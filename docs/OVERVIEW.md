# Overview of dependency injection with depenject

> *A dependency is any object that another object requires.*

Examine the following `MyDependency` class with a `LogMessage` method that other classes in an app depend upon:

```typescript
class MyDependency
{
  LogMessage(message: string)
  {
    console.log(`Message: ${message}`);
  }
}
```

An instance of the `MyDependency` class can be created to make the `LogMessage` method available to other class. The `MyDependency` class is a dependency of the `SomeService` class:

```typescript
class SomeService
{
  private _dependency = new MyDependency();

  DoAction() {
    this._dependency.LogMessage("SomeService.DoAction called.");
  }
}
```

This class creates and directly depends on the `MyDependency` instance. Code dependencies (such as the previous example) are problematic and should be avoided for the following reasons:

* To replace `MyDependency` with a different implementation, the class must be modified.

* If `MyDependency` has dependencies, they must be configured by the class. In a large project with multiple classes depending on `MyDependency`, the configuration code becomes scattered across the app.

* This implementation is difficult to unit test. The app should use a mock or stub `MyDependency` class, which isn't possible with this approach.

**depenject** addresses these problems through:

* The use of an base class to abstract the dependency implementation (*in the future*).

* Registration of the dependency in a `Container`. Dependencies are registered by `ContainerBuilder.register`, `ContainerBuilder.registerScoped` and `ContainerBuilder.registerSingleton` methods. And the `Container` is provided by `ContainerBuilder.build` method.

* *Injection* of the dependencies into the constructor of the class is realized through a `[resolver]` static method in the target class.

In the above sample, the `SomeService` should be defined like below:

```typescript
import { resolver, Container } from 'depenject';

class SomeService
{
  private _dependency: MyDependency;

  constructor(dependency: MyDependency) {
    this._dependency = dependency;
  }

  static [resolver](container: Container) {
    return new SomeService(container.resolve(MyDependency));
  }

  DoAction() {
    this._dependency.LogMessage("SomeService.DoAction called.");
  }
}
```

When a `SomeService` instance is requested, the `[resolver]` static method are responsible for instantiating the `SomeService`. The source `Container` is injected in this method to resolve any required dependencies. The collective set of dependencies that must be resolved is typically referred to as a *dependency tree*, *dependency graph*, or *object graph*.

> The `[resolver]`'s `Container` instance may be reused in future as needed. Like this:
  
```typescript
class SomeService
{
  private _container: Container;

  constructor(container: Container) {
    this._container = container;
  }

  static [resolver](container: Container) {
    return new SomeService(container);
  }

  DoAction() {
    let dependency = this._container.resolve(MyDependency);

    dependency.LogMessage("SomeService.DoAction called.");
  }
}
```

The `MyDependency` and the `SomeService` classes must be registered in the container to define the lifetime of their instances.

```typescript
import { ContainerBuilder } from 'depenject';

const container = new ContainerBuilder()
  .registerSingleton(MyDependency)
  .register(SomeService);
```

## Dependency lifetimes

**depenject** offers three lifetimes to register dependencies:

### Transient lifetime

Transient lifetime dependencies (`ContainerBuilder.register`) are created each time they're requested from the container. This lifetime works best for lightweight and stateless dependencies.

> If a class is not registered before being requested, it will be automatically registered and resolved as a transient dependency.

### Scoped lifetime

Scoped lifetime dependencies (`ContainerBuilder.registerScoped`) are created once per scoped container instance. A container must be created by calling `ContainerBuilder.build` (creates a root scoped container) or `Container.createScope` (derives a scoped container from the respect container) methods.

### Singleton lifetime

Singleton lifetime dependencies (`ContainerBuilder.registerSingleton`) are created the first time they're requested. Every subsequent request uses the same instance.

## Design services for dependency injection

Best practices are to:

* Design services to use dependency injection to obtain their dependencies.

* Avoid stateful, static classes and members. Design apps to use singleton services instead, which avoid creating global state.

* Avoid direct instantiation of dependent classes within services. Direct instantiation couples the code to a particular implementation.

* Make app classes small, well-factored, and easily tested.

If a class seems to have too many injected dependencies, this is generally a sign that the class has too many responsibilities and is violating the *Single Responsibility Principle (SRP)*. Attempt to refactor the class by moving some of its responsibilities into a new class.

# Credits

**depenject** is based on Microsoft .NET Core dependency injection approach. This overview is based on [their documentation](https://docs.microsoft.com/pt-br/aspnet/core/fundamentals/dependency-injection).