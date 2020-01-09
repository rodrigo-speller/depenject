import { Container, ContainerBuilder, resolver } from 'depenject';

///
/// Define types
///

class HelloService {
  private nameProvider: NameProvider;

  constructor(nameProvider: NameProvider) {
    this.nameProvider = nameProvider;
  }

  static [resolver](container: Container) {
    return new HelloService(container.resolve(NameProvider));
  }

  sayHello() {
    console.log("Hello " + this.nameProvider.name + "!")
  }
}

class NameProvider {
  public name: string = "World";
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