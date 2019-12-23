import ContainerBuilder, { resolver } from '../lib'
import { Container } from '../lib/abstractions';

import { expect } from 'chai'

class SampleService {
  static [resolver](container: Container): SampleService {
    return new SampleService();
  }
}

describe('ContainerBuilder.register tests', () => {
  it('register a transient service', () => {
    let container = new ContainerBuilder()
      .register(SampleService)
      .build();

    expect(container).exist;
  });

  it('register string-tagged transient service', () => {
    let container = new ContainerBuilder()
      .register('sample', SampleService)
      .build();

    expect(container).exist;
  });

  it('register symbol-tagged transient service', () => {
    let container = new ContainerBuilder()
      .register(Symbol(), SampleService)
      .build();

    expect(container).exist;
  });

  it('register a singleton service', () => {
    let container = new ContainerBuilder()
      .registerSingleton(SampleService)
      .build();

    expect(container).exist;
  });

  it('register string-tagged Singleton service', () => {
    let container = new ContainerBuilder()
      .registerSingleton('sample', SampleService)
      .build();

    expect(container).exist;
  });

  it('register symbol-tagged Singleton service', () => {
    let container = new ContainerBuilder()
      .registerSingleton(Symbol(), SampleService)
      .build();

    expect(container).exist;
  });

  it('invalid registration', () => {
    let someValue: any = null;

    expect(() => new ContainerBuilder().register(someValue))
      .throw(TypeError)
  });
});