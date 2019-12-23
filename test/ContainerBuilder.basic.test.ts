import ContainerBuilder from '../lib'
import { expect } from 'chai'

describe('ContainerBuilder basic tests', () => {
  it('build', () => {
    let container = new ContainerBuilder().build();

    expect(container).exist;
  });
});