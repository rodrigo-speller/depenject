import { Container, ContainerBuilder, resolver } from '../lib';
import { expect } from 'chai';
import CircularDependencyError from '../lib/Error/CircularDependencyError';

class SingleDependencyService {
  dependency: CircularDependencyService;

  constructor(dependecy: CircularDependencyService)
  {
    this.dependency = dependecy;
  }

  static [resolver](container: Container): SingleDependencyService {
    return new SingleDependencyService(
      container.resolve(CircularDependencyService)
    );
  }
}

class CircularDependencyService {
  dependency: SingleDependencyService;

  constructor(dependency: SingleDependencyService)
  {
    this.dependency = dependency;
  }

  static [resolver](container: Container): CircularDependencyService {
    return new CircularDependencyService(
      container.resolve(SingleDependencyService)
    );
  }
}

describe('Container.resolve error tests', () => {
  it('resolve a circular dependency', () => {
    let container = new ContainerBuilder()
      .register(SingleDependencyService)
      .register(CircularDependencyService)
      .build();

    expect(() => container.resolve(SingleDependencyService))
      .throws(CircularDependencyError);
  });
});