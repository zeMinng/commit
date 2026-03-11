---
title: "TypeScript"
date: "2026-03-11"
description: "TypeScript 基础语法、高级类型、泛型与装饰器详解"
tags:
  - 工程化
---

# TypeScript

## 概要

[TypeScript](https://www.typescriptlang.org/zh/) 是 JavaScript 的超集，增加了强类型和其他特性。其核心特点包括：类型系统、增强的代码提示和自动补全、ES6+ 特性支持、类与接口、兼容性。通过 TypeScript，开发者可以在开发阶段捕获潜在错误，使代码更加可靠和可维护，尤其适合大型项目。

## 一、TypeScript 基础

### 1. 类型注解与基本类型

TypeScript 最核心的特性是类型系统，通过类型注解可以明确变量的类型：

| 类型    |      例子       |              描述              |
| ------- | :-------------: | :----------------------------: |
| number  |    1,-33,2.5    |            任意数字            |
| string  |      'hi'       |           任意字符串           |
| boolean |   true、false   |       布尔值true或false        |
| 字面量  |     其本身      |  限制变量的值就是该字面量的值  |
| any     |       \*        |            任意类型            |
| unknown |       \*        |         类型安全的any          |
| void    | 空置(undefined) |      没有值(或undefined)       |
| never   |     没有值      |          不能是任何值          |
| object  |  _{name:'xx'}_  |          任意的JS对象          |
| array   |     [1,2,3]     |          任意的JS数组          |
| tuple   |      [4,5]      | 元素，TS新增类型，固定长度数组 |
| enum    |  enum _{A,B}_   |       枚举，TS中新增类型       |

::: details 语法和举例
```ts
/** 如果a的类型为unknown */
let a: unknown
a = 99
a = '123'

let b: string
// 方法一
if (typeof a === 'string') {
  b = a
}
// 方法二 断言
b = a as string // 或 b = <string>a

/** 如果a的类型为object */
let a: {
  name: string
  [key: string]: any // 索引签名
}
a = {
  name: 'sd',
  age: 88,
}
```
:::

:::code-group
```ts [数据类型]
// 基本类型注解
let count: number = 10
let message: string = "Hello TypeScript"
let isDone: boolean = false
let u: undefined = undefined
let n: null = null

// 数组类型
let numbers: number[] = [1, 2, 3]
let strings: Array<string> = ["a", "b", "c"] // 泛型形式

// 元组类型（固定长度和类型的数组）
let tuple: [string, number] = ["age", 25]
```
:::


### 2. 枚举（Enum）

枚举是 TypeScript 中用于定义命名常量集合的特殊类型，能让相关常量更具可读性和维护性。

:::code-group
```ts [数字枚举]
/** 1.数字枚举（默认） */
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}
console.log(Direction.Up)    // 输出: 0
console.log(Direction.Right) // 输出: 3
const walk = (data: Direction) => {
  data // 0
  if (data === Direction.Up) {}
}
walk(Direction.Up)
```

```ts [手动设置枚举值]
// 可手动指定成员值，未指定的成员会基于前一个值自动递增：
enum Status {
  Pending = 1,  // 手动设置起始值
  Approved,     // 自动为 2
  Rejected = 5, // 手动设置值
  Cancelled     // 自动为 6
}

console.log(Status.Approved)  // 输出: 2
console.log(Status.Cancelled) // 输出: 6
```

```ts [字符串枚举]
// 成员为字符串时，需为每个成员显式赋值，适合明确标识场景：
enum MessageType {
  Success = "SUCCESS",
  Error = "ERROR",
  Warning = "WARNING",
  Info = "INFO"
}

// 应用：API 响应状态处理
function handleResponse(type: MessageType) {
  switch(type) {
    case MessageType.Success:
      console.log("操作成功")
      break
    case MessageType.Error:
      console.log("操作失败")
      break
  }
}
handleResponse(MessageType.Success) // 输出: 操作成功
```

```tsx [特殊枚举类型]
/** 反向映射：数字枚举支持通过值获取键名，字符串枚举不支持 */
enum Role {
  Admin,
  User,
  Guest
}
console.log(Role.User) // 正向映射：1
console.log(Role[1])   // 反向映射："User"

/** 常量枚举：用 const enum 定义，编译时会被移除，成员直接替换为值，减少代码体积 */
const enum Weekday {
  Monday,
  Tuesday,
  Wednesday
}
const today = Weekday.Monday // 编译后：const today = 0;
```
:::

### 3. 类型别名（type）

type 是一种为类型创建别名的方式，可以简化复杂类型的使用，提高代码可读性和复用性。它可以为基本类型、联合类型、交叉类型、对象类型、函数类型等几乎所有 TypeScript 类型创建别名。

:::code-group
```ts [联合交叉类型]
/** 联合类型 */
type Status = number | string
type Gender = '男' | '女'
const printStatus = (data: Status) => {}
printStatus(404) // printStatus('404')

/** 交叉类型 */
type Area = {
  width: number
  height: number
}
type Address = {
  room: string
  cell: number
}
type House = Area & Address
```

```ts [函数泛型类型]
/** 为函数类型创建别名 */
type AddFunc = (a: number, b: number) => number // 定义一个函数类型别名
const add: AddFunc = (x, y) => x + y // 使用别名定义函数
console.log(add(2, 3)) // 5

/** 与泛型结合（创建可复用的通用类型） */
type Container<T> = {
  value: T;
  getValue: () => T;
} // 定义一个“容器”类型，可存放任意类型的值
const numberContainer: Container<number> = {
  value: 10,
  getValue: () => 10,
} // 使用时指定具体类型
const stringContainer: Container<string> = {
  value: 'test',
  getValue: () => 'test',
}
```

```ts [特殊情况]
// https://www.typescriptlang.org/docs/handbook/2/functions.html#assignability-of-functions
// 总结：使用类型声明限制函数返回值为void时，TypeScript 并不会严格要求函数返回空
type LogFunc = () => void // 换undefined

const f1 = () => 200 // 允许返回非空值

let x = f1()
if (x) {
} // 会报错
```

:::

### 4. 函数类型

函数的参数和返回值都可以添加类型注解：

```ts
// 函数声明
function add(x: number, y: number): number {
  return x + y
}

// 函数表达式
const multiply: (x: number, y: number) => number = (x, y) => x * y

// 可选参数（必须放在必选参数后面）
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}`
}

// 默认参数
function log(message: string, level: string = "info"): void {
  console.log(`[${level}] ${message}`)
}
```

## 二、高级类型特性

### 1. 接口（interface）

接口用于定义对象的结构，是 TypeScript 中非常重要的类型定义方式。主要作用是为：类、对象、函数等规定一种契约这样可以确保代码的一致性和类型安全，但要注意 **interface 只能定义格式，不能包含任何实现!**

::: code-group
```ts [定义对象]
interface UserInterface {
  readonly gender: string // 只读属性
  name: string
  age?: number // 可选属性
  run: (n: number) => void
  [propName: string]: any // 索引签名，允许其他任意属性
}

const user: UserInterface = {
  name: '张三',
  gender: '男',
  age: 13,
  run(n) {},
  email: 'alice@example.com' // 符合索引签名
}
```

```ts [定义函数结构]
interface CountInterface {
  (a: number, b: number): number
}

const count: CountInterface = (x, y) => {
  return x + y
}
```

```ts [定义类结构]
interface PersonInterface {
  name: string
  age: number
  speak(n: number): void
}

class Person implements PersonInterface {
  constructor(
    public name: string,
    public age: number,
  ) {}
  speak(n: number): void {
    for (let i = 0; i < n; i++) {}
  }
}

const p1 = new Person('老三', 8)
p1.speak(3)
```

```ts [接口之间继承]
interface PersonInterface {
  name: string
  age: number
}

interface StudentInterface extends PersonInterface {
  grade: string
}
```

:::

**什么时候使用接口？**

- 定义对象的格式：描述数据模型、API响应格式、配置对象...等等，是开发中用最多的场景。
- 类的契约：规定一个类需要实现哪些属性和方法。
- 自动合并：一般用于扩展第三方库的类型，这种特性在大型项目中可能会用到。


### 2. 泛型（Generics）

泛型提供了创建可复用组件的能力，允许在定义时不指定具体类型，而是在使用时指定。**泛型**允许我们在定义函数、类或接口时，使用类型参数来表示**未指定的类型**，这些参数在具体**使用时**才被指定**具体的类型**，泛型能让同一段代码适用于多种类型，同时仍然保持类型的安全性。

:::code-group
```ts [简单定义]
function logData<T>(data: T) {
  console.log(data)
}
const logData = <T>(data: T) => {
  console.log(data)
}
// TSX 环境中推荐的写法
const logData = <T extends unknown>(data: T) => {
  console.log(data)
}

logData<number>(10)
logData<string>('szd')


/** 多个泛型 */
function logData<T, U>(data: T, str: U): T | U {
  return Date.now() % 2 ? data : str
}
logData<number, string>(10, 'sdf')
logData<string, boolean>('szd', false)
```

```ts [泛型接口]
interface PersonInterface<T> {
  name: string
  age: number
  extraInfo: T
  getValue: () => T
}
let p: PersonInterface<string> = {
  name: 'zhangsan',
  age: 20,
  extraInfo: '这是个字符串',
  getValue: () => this.extraInfo // 也可以返回其他 string 类型值
}

/** 或者 */
type JobInfo = {
  title: string
  company: string
}
let p: PersonInterface<JobInfo> = {
  name: 'zhangsan',
  age: 20,
  extraInfo: {
    title: '前端工程师',
    company: '阿里巴巴',
  },
}
```

```ts [泛型类]
class Person<T> {
  constructor(
    public name: string,
    public age: number,
    public sex: T,
  ) {}
  speak(): T {
    console.log(this.name, this.age, this.sex)
    return this.sex
  }
}

const p = new Person<string>('小明', 18, '男')
```

:::

### 3. 相似概念区别

**3.1 interface 与 type 的区别**

**相同点：** `interface` 和 `type` 都可以用于定义**对象结构**，两者在许多场景中是可以互换的。

**不同点：**

|特性|interface|type|
|---|---|---|
|**核心能力**|专注于定义对象和类的结构|可定义类型别名、联合、交叉(&)等复杂类型|
|**继承支持**|支持（通过 `extends` 实现）|不支持继承（但可通过交叉类型模拟）	|
|**自动合并**|支持（重复定义会自动合并属性）|不支持（重复定义会报错）|
|**适用场景**|描述对象 / 类的契约、需要扩展的结构	|处理复杂类型组合（如联合、交叉）、基本类型别名|

**3.2 interface 与抽象类的区别**

**相同点：** 都用于定义一个**类的格式**（应该遵循的契约）

**不同点：**

|特性|interface|抽象类（abstract class）|
|---|---|---|
|**代码实现**|仅描述结构，无任何具体代码，一个类可以实现多个接口|可包含抽象方法（无实现）和具体方法（有实现），一个类只能继承一个抽象类|
|**使用方式**|类通过 `implements` 实现（支持多实现）|类通过 `extends` 继承（仅支持单继承）|
|**属性定义**|仅声明属性类型，不能初始化值|可声明并初始化属性值（提供基础数据）|
|**核心用途**|定义跨类的通用接口规范（多实现）|定义类的继承体系（单继承），提供基础实现|

## 三、声明文件

**TypeScript 声明文件**（Declaration File） 是以 `.d.ts` 为后缀的文件，用于向 TypeScript 提供类型声明信息。使得 TypeScript 能够在使用这些 JavaScript 库或模块时进行类型检查和提示。它告诉 TypeScript 编译器某些 JavaScript 代码的类型信息，而无需直接修改这些代码。

项目中，当你想使用未用 TypeScript 编写的库（如普通 JavaScript 库）时，TypeScript 无法推断它们的类型。此时，可以使用声明文件来为这些库提供类型支持。

```ts
declare function add(a: number, b: number): number

export { add }
```

## 四、装饰器

装饰器本质是一种特殊的函数，它可以对:类、属性、方法、参数进行扩展，同时能让代码更简洁。

**装饰器有 5 种：类装饰器、属性装饰器、方法装饰器、访问器装饰器、参数装饰器。**

### 1. 类装饰器

类装饰器是一个应用在类声明上的函数，可以为类添加额外的功能，或添加额外的逻辑。

**类装饰器有返回值：** 若类装饰器返回一个新的类，那这个新类将**替换**掉被装饰的类。

**类装饰器无返回值：** 若类装饰器无返回值或返回 `undefined` ，那被装饰的类不会被替换。

```ts
/**
 * Demo函数会在Person类定义时执行
 * 参数说明：target是被装饰的类，即：Person
 */
function CustomString(target: Function) {
  console.log(target)
  target.prototype.toString = function () {
    return Json.stringify(this)
  }
  Object.seal(target.prototype)
}

@CustomString
class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

const p1 = new Person('咋', 18)
console.log(p1.toString())
```

**关于构造类型**
::: details 关于构造类型

```ts
// 仅声明构造类型
type Constructor = new (...args: any[]) => {}
function test(fn: Constructor) {}
class Person {}
text(Person)

// 声明构造类型 + 指定静态属性
type Constructor = {
  new (...args: any[]): {}
  wife: string
}
function test(fn: Constructor) {}
class Person {
  static wife: string
}
text(Person)
```

:::

::: details 替换被装饰的类

```ts
type Constructor = new (...args: any[]) => {}

interface Person {
  getTime(): void
}
function LogTime<T extends Constructor>(target: T) {
  return class extends target {
    createdTime: Date
    constructor(...args: any[]) {
      super(...args)
      this.createdTime = new Date()
    }
    getTime() {
      console.log(this.createdTime)
    }
  }
}

@LogTime
class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

const p1 = new Person('张三', 18)
console.log(p1.getTime())
```

:::

## 小结

:::info 📖 相关资源
- [ts 官方文档](https://www.typescriptlang.org/zh/) - 官方文档
- [B站视频教程](https://www.bilibili.com/video/BV1gX4y177Kf/) - 吴悠讲编程
:::
