import { Container, ContainerBuilder, resolver } from '../lib'
import { expect } from 'chai'

class SampleService { }

describe('ContainerBuilder.register tests', () => {
  it('register a transient service', () => {
    let container = new ContainerBuilder()
      .register(SampleService)
      .build();

    expect(container).instanceOf(Container);
  });

  it('register string-tagged transient service', () => {
    let container = new ContainerBuilder()
      .register('sample', SampleService)
      .build();

    expect(container).instanceOf(Container);
  });

  it('register symbol-tagged transient service', () => {
    let container = new ContainerBuilder()
      .register(Symbol(), SampleService)
      .build();

    expect(container).instanceOf(Container);
  });

  it('register a singleton service', () => {
    let container = new ContainerBuilder()
      .registerSingleton(SampleService)
      .build();

    expect(container).instanceOf(Container);
  });

  it('register string-tagged Singleton service', () => {
    let container = new ContainerBuilder()
      .registerSingleton('sample', SampleService)
      .build();

    expect(container).instanceOf(Container);
  });

  it('register symbol-tagged Singleton service', () => {
    let container = new ContainerBuilder()
      .registerSingleton(Symbol(), SampleService)
      .build();

    expect(container).instanceOf(Container);
  });

  it('invalid registration', () => {
    let someValue: any = null;

    expect(() => new ContainerBuilder().register(someValue))
      .throw(TypeError)
  });
});