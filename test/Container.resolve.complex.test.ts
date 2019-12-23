import { Container, ContainerBuilder, resolver } from '../lib';
import { expect } from 'chai';

class SingleDependencyService {
  dependency: DependencyService;

  constructor(dependecy: DependencyService)
  {
    this.dependency = dependecy;
  }

  static [resolver](container: Container): SingleDependencyService {
    return new SingleDependencyService(
      container.resolve(DependencyService)
    );
  }
}

class TwoDependencyService {
  dependencyA: DependencyService;
  dependencyB: NotRegisteredService;

  constructor(dependecyA: DependencyService, dependencyB: NotRegisteredService)
  {
    this.dependencyA = dependecyA;
    this.dependencyB = dependencyB;
  }

  static [resolver](container: Container): TwoDependencyService {
    return new TwoDependencyService(
      container.resolve(DependencyService),
      container.resolve(NotRegisteredService)
    );
  }
}

class DependencyService {
  static [resolver](container: Container): DependencyService {
    return new DependencyService();
  }
}

class NotRegisteredService {
  static [resolver](container: Container): NotRegisteredService {
    return new NotRegisteredService();
  }
}

describe('Complex Container.resolve tests', () => {
  it('resolve a service with a registered dependency', () => {
    let container = new ContainerBuilder()
      .register(SingleDependencyService)
      .register(DependencyService)
      .build();

    let service = container.resolve(SingleDependencyService);

    expect(service).instanceOf(SingleDependencyService);
    expect(service.dependency).instanceOf(DependencyService);
  });

  it('resolve a service with a registered dependency and another not registered dependency', () => {
    let container = new ContainerBuilder()
      .register(TwoDependencyService)
      .register(DependencyService)
      .build();

    let service = container.resolve(TwoDependencyService);

    expect(service).instanceOf(TwoDependencyService);
    expect(service.dependencyA).instanceOf(DependencyService);
    expect(service.dependencyB).instanceOf(NotRegisteredService);
  });
});