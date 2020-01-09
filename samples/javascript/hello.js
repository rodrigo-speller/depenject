let { Container, ContainerBuilder, resolver } = require('depenject');

///
/// Define types
///

class HelloService {
  /**
   * @type {NameProvider}
   */
  nameProvider;

  /**
   * @param {NameProvider} nameProvider 
   */
  constructor(nameProvider) {
    this.nameProvider = nameProvider;
  }

  /**
   * @param {Container} container 
   */
  static [resolver](container) {
    return new HelloService(container.resolve(NameProvider));
  }

  sayHello() {
    console.log("Hello " + this.nameProvider.name + "!")
  }
}

class NameProvider {
  /**
   * @type {string}
   */
  name = "World";
}

///
/// Sample code
///

let container = new ContainerBuilder()
  .register(HelloService)
  .registerSingleton(NameProvider)
  .build();

// resolve dependencies

let helloService = container.resolve(HelloService);
let nameProvider = container.resolve(NameProvider);

// execution

helloService.sayHello();
nameProvider.name = "Rodrigo Speller"
helloService.sayHello();