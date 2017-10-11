# dragonjs-vui
VUI는 사용자의 음성을 통해서 웹 사이트와 소통 역할을 하는 소프트웨어이다.

### 개발 환경 설정

VUI는 [Grunt](https://gruntjs.com) `~0.4.5` [Node.js](https://nodejs.org/ko/) `>=4.6.0`에서 개발이 되었다. **샘플 GUI 실행** 및 **jsdoc 생성**하기 위해서는 Node.js는 설치되어야 한다.

#### 소스 설치

```shell
$ git clone https://github.com/ChoDragon9/dragonjs-vui.git
$ cd dragonjs-vui
$ npm install
```
### 테스트

#### 샘플 GUI 실행

아래와 같이 `grunt server:app`을 실행하게 되면, `http://127.0.0.1:7777/simulator/index.html`로 브라우저가 실행된다.

```shell
$ grunt server:app
```

#### jsdoc 생성

산출물은 `docs` 폴더에서 확인한다.

```bash
$ grunt jsdoc:app
```

#### Javascript 정적분석 결과 생성

산출물은 `plato-report` 폴더에서 확인한다.

```bash
$ grunt plato
```

#### Javascript Unit Test 결과 확인

`test/index.html`을 실행한다.

#### 커버리지 결과 생성

산출물은 `coverage` 폴더에서 확인한다.

```bash
$ npm run coverage
```

### 설계 고려 사항

#### 가정 및 의존성

 * 해당 SW는 웹 브라우저에서 동작하는 SW이다.
 * VUI은 별도의 하드웨어 및 음성 파일을 제공하지 않으며, W3C(Word Wide Web Consortium)에 정의된 Web Speech API Specification에 의존한다.

#### 제약 사항

 * Window 7, Window 10 OS호환성을 보장한다.
 * Chrome 웹 브라우저 호환성에 보장한다.
 * ECMA Script 6 명세를 기준으로 개발되었다.

#### 운영 환경

 * 하드웨어
   * CPU : Intel® Core™ i5-3330 CPU @ 3.00Hz
   * RAM : 4.00GB
 * OS(운영체제)
   * Windows 7 Enterprise K
   * Window 10

#### 폴더 및 파일 구조

 * `modules` : VUI 모듈들
 * `spec` : VUI 모듈들의 jasmine spec 파일 
 * `test` : VUI 모듈들의 jasmine Unit Test 결과
 * `simulator` : VUI 모듈 샘플 GUI
 * `node_modules` : Grunt 관련 모듈들
 * `docs` : jsdoc 산출물
 * `plato-report` : plato 산출물
