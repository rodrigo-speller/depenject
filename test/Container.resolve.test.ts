import ContainerBuilder, { resolver } from '../lib'
import { Container } from '../lib/abstractions';

import { expect } from 'chai'

class SampleService {
  static [resolver](container: Container): SampleService {
    return new SampleService();
  }
}

describe('Container.resolve tests', () => {
  it('resolve a transient service', () => {
    let container = new ContainerBuilder()
      .register(SampleService)
      .build();

    let a = container.resolve(SampleService);
    let b = container.resolve(SampleService);

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).not.equal(b);
  });

  it('resolve string-tagged transient service', () => {
    let container = new ContainerBuilder()
      .register('sample', SampleService)
      .build();

    let a = container.resolve<SampleService>('sample');
    let b = container.resolve<SampleService>('sample');

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).not.equal(b);
  });

  it('resolve string-tagged transient service registered with factory', () => {
    let container = new ContainerBuilder()
      .register('sample', () => new SampleService())
      .build();

    let a = container.resolve<SampleService>('sample');
    let b = container.resolve<SampleService>('sample');

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).not.equal(b);
  });

  it('resolve symbol-tagged transient service', () => {
    let symbol = Symbol();
    let container = new ContainerBuilder()
      .register(symbol, SampleService)
      .build();

    let a = container.resolve<SampleService>(symbol);
    let b = container.resolve<SampleService>(symbol);

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).not.equal(b);
  });

  it('resolve symbol-tagged transient service registered with factory', () => {
    let symbol = Symbol();
    let container = new ContainerBuilder()
      .register(symbol, () => new SampleService)
      .build();

    let a = container.resolve<SampleService>(symbol);
    let b = container.resolve<SampleService>(symbol);

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).not.equal(b);
  });

  it('resolve a singleton service', () => {
    let container = new ContainerBuilder()
      .registerSingleton(SampleService)
      .build();

    let a = container.resolve(SampleService);
    let b = container.resolve(SampleService);

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).equal(b);
  });

  it('resolve string-tagged Singleton service', () => {
    let container = new ContainerBuilder()
      .registerSingleton('sample', SampleService)
      .build();

    let a = container.resolve<SampleService>('sample');
    let b = container.resolve<SampleService>('sample');

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).equal(b);
  });

  it('resolve string-tagged Singleton service registered with factory', () => {
    let container = new ContainerBuilder()
      .registerSingleton('sample', () => new SampleService())
      .build();

    let a = container.resolve<SampleService>('sample');
    let b = container.resolve<SampleService>('sample');

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).equal(b);
  });

  it('resolve symbol-tagged Singleton service', () => {
    let symbol = Symbol();
    let container = new ContainerBuilder()
      .registerSingleton(symbol, SampleService)
      .build();

    let a = container.resolve<SampleService>(symbol);
    let b = container.resolve<SampleService>(symbol);

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).equal(b);
  });

  it('resolve symbol-tagged Singleton service registered with factory', () => {
    let symbol = Symbol();
    let container = new ContainerBuilder()
      .registerSingleton(symbol, () => new SampleService())
      .build();

    let a = container.resolve<SampleService>(symbol);
    let b = container.resolve<SampleService>(symbol);

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).equal(b);
  });

  it('resolve not registered service', () => {
    let container = new ContainerBuilder()
      .build();

    let a = container.resolve(SampleService);
    let b = container.resolve(SampleService);

    expect(a).exist.instanceOf(SampleService);
    expect(b).exist.instanceOf(SampleService);
    
    expect(a).not.equal(b);
  });

  it('resolve not registered tag', () => {
    let container = new ContainerBuilder()
      .build();

    let a = container.resolve('sample');
    let b = container.resolve(Symbol());

    expect(a).undefined;
    expect(b).undefined;
  });

  it('resolve double registered string-tag', () => {
    let container = new ContainerBuilder()
      .register('sample', () => new Object())
      .register('sample', () => new SampleService())
      .build();

    let a = container.resolve('sample');

    expect(a).exist.instanceOf(SampleService);
  });

  it('resolve double registered symbol-tag', () => {
    let symbol = Symbol();
    let container = new ContainerBuilder()
      .register(symbol, () => new Object())
      .register(symbol, () => new SampleService())
      .build();

    let a = container.resolve(symbol);

    expect(a).exist.instanceOf(SampleService);
  });
});