import { Container, ContainerBuilder, resolver } from '../lib';
import { expect } from 'chai';
import CircularDependencyError from '../lib/Error/CircularDependencyError';

class SingleDependencyService {
  dependency: CircularDependencyService;

  constructor(container: Container)
  {
    this.dependency = container.resolve(CircularDependencyService);
  }
}

class CircularDependencyService {
  dependency: SingleDependencyService;

  constructor(container: Container)
  {
    this.dependency = container.resolve(SingleDependencyService);
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