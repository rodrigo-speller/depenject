import { Container, ContainerBuilder, resolver } from '../lib';
import { expect } from 'chai';

class ComplexService {
  singletonDependency: SingletonService;
  scopedDependency: ScopedService;
  superScopedService: SuperScopedService;

  constructor(singletonDependency: SingletonService, scopedDependency: ScopedService, superScopedService: SuperScopedService)
  {
    this.singletonDependency = singletonDependency;
    this.scopedDependency = scopedDependency;
    this.superScopedService = superScopedService;
  }

  static [resolver](container: Container): ComplexService {
    let superScopedContainer = container.createScope();

    return new ComplexService(
      container.resolve(SingletonService),
      container.resolve(ScopedService),
      superScopedContainer.resolve(SuperScopedService)
    );
  }
}

class SingletonService {
  static [resolver](container: Container): SingletonService {
    return new SingletonService();
  }
}

class ScopedService {
  static [resolver](container: Container): ScopedService {
    return new ScopedService();
  }
}

class SuperScopedService {
  singletonDependency: SingletonService;
  scopedDependency: ScopedService;

  constructor(singletonDependency: SingletonService, scopedDependency: ScopedService)
  {
    this.singletonDependency = singletonDependency;
    this.scopedDependency = scopedDependency
  }

  static [resolver](container: Container): SuperScopedService {
    return new SuperScopedService(
      container.resolve(SingletonService),
      container.resolve(ScopedService)
    );
  }
}

describe('Container integration tests', () => {
  it('Full integration test', () => {
    let container = new ContainerBuilder()
      .register(ComplexService)
      .registerSingleton(SingletonService)
      .registerScoped(ScopedService)
      .build();

    // testing scopes

    let scopeA = container.createScope();
    let scopeB = container.createScope();

    expect(scopeA).instanceOf(Container);
    expect(scopeB).instanceOf(Container);
    
    expect(scopeA).not.equals(scopeB);

    // testing transient services

    let service = container.resolve(ComplexService);
    let serviceA = scopeA.resolve(ComplexService);
    let serviceB = scopeB.resolve(ComplexService);

    expect(service)
      .instanceOf(ComplexService)
      .not.equals(serviceA)
      .not.equals(serviceB);

    // testing scoped services

    let scopedService1 = container.resolve(ScopedService);
    let scopedService2 = container.resolve(ScopedService);

    expect(scopedService1)
      .instanceOf(ScopedService)
      .equals(scopedService2)
      .equals(service.scopedDependency);

    let scopedServiceA1 = scopeA.resolve(ScopedService);
    let scopedServiceA2 = scopeA.resolve(ScopedService);

    expect(scopedServiceA1)
      .instanceOf(ScopedService)
      .equals(scopedServiceA2)
      .equals(serviceA.scopedDependency);

    let scopedServiceB1 = scopeB.resolve(ScopedService);
    let scopedServiceB2 = scopeB.resolve(ScopedService);

    expect(scopedServiceB1)
      .instanceOf(ScopedService)
      .equals(scopedServiceB2)
      .equals(serviceB.scopedDependency);

    expect(scopedService1)
      .not.equals(scopedServiceA1)
      .not.equals(scopedServiceB1);

    // testing singleton services

    let singletonService1 = container.resolve(SingletonService);
    let singletonService2 = container.resolve(SingletonService);
    let singletonServiceA1 = scopeA.resolve(SingletonService);
    let singletonServiceA2 = scopeA.resolve(SingletonService);
    let singletonServiceB1 = scopeB.resolve(SingletonService);
    let singletonServiceB2 = scopeB.resolve(SingletonService);
    
    expect(singletonService1)
      .instanceOf(SingletonService)
      .equals(service.singletonDependency)
      .equals(service.superScopedService.singletonDependency)
      .equals(serviceA.singletonDependency)
      .equals(serviceA.superScopedService.singletonDependency)
      .equals(serviceB.singletonDependency)
      .equals(serviceB.superScopedService.singletonDependency)
      .equals(singletonService2)
      .equals(singletonServiceA1)
      .equals(singletonServiceA2)
      .equals(singletonServiceB1)
      .equals(singletonServiceB2);

    // super-scoped dependencies

    expect(service.superScopedService.scopedDependency)
      .instanceOf(ScopedService)
      .not.equals(service.scopedDependency)

    expect(serviceA.superScopedService.scopedDependency)
      .instanceOf(ScopedService)
      .not.equals(serviceA.scopedDependency)

    expect(serviceB.superScopedService.scopedDependency)
      .instanceOf(ScopedService)
      .not.equals(serviceB.scopedDependency)

    expect(singletonService1)
      .instanceOf(SingletonService)
      .equals(service.superScopedService.singletonDependency)
      .equals(serviceA.superScopedService.singletonDependency)
      .equals(serviceB.superScopedService.singletonDependency)
  });
});