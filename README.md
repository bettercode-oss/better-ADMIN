# better ADMIN ✨

Admin 사이트를 만들다 보면 정작 중요한 업무 페이지를 만드는 것 보다
이른바 공통으로 부르는 기능(예. 화면 레이아웃, 사용자 인증, 권한 체계 등)을 매번 만드는데 시간이 쓴다.
하지만 공통이라고 부르는 부분을 업무 페이지와 달리 기술적 난이도가 상대적으로 높아 잘 만들기 쉽지 않다.

**1. Config 방식으로 화면 레이아웃(Layout) 자동 생성 기능 지원**
* Header, Contnets, Footer
* Navigation
  * GNB(Global Navigation Bar)
  * LNB(Local Navigation Bar)
  * SNB(Side Navigation Bar)
  * Breadcrumb

![image](https://user-images.githubusercontent.com/16472109/113784793-f9eb2280-9770-11eb-8d78-deea642fa855.png)

**2. 보다 안전한 로그인 방식 지원**
* 토큰을 사용한 인증 방식 채용(JWT)
* 만료 기간이 다른 두 개의 토큰(엑세스 토큰, 리프레시 토큰)을 생성하여 사용
  * 액세스 토큰(Access Token): 인증이 필요한 요청에 액세스 토큰을 사용합니다. 일반적으로 요청 헤더에 추가됩니다. 액세스 토큰의 수명은 15분 정도로 짧을 것을 권장한다. 액세스 토큰에 짧은 시간 간격을 부여하면 토큰이 탈취되더라도 심각한 공격을 방지할 수 있습니다. 해커는 토큰이 무효화되기 전에 자신의 작업을 수행할 수 있는 시간이 15분 이하밖에 없기 때문입니다.
  * 리프래시 토큰(Refresh Token): 리프래시 토큰은 일반적으로 7일 정도로 설정하며 액세스 토큰보다 유효기간이 더 깁니다. 이 토큰은 새로운 액세스를 생성하고 액세스 토큰을 다시 발급받는데 사용합니다. 액세스 토큰이 만료되는 경우 리프래시 토큰을 보내서 새로운 액세스 및 리프래시 토큰을 생성합니다.
* RefreshToken을 secure httpOnly 쿠키로, AccessToken은 JSON payload로 받아와서 웹 어플리케이션 내 로컬 변수로 이용
  * CSRF 취약점 공격 방어하고, XSS 취약점 공격으로 저장된 유저 정보 읽기는 막을 수 있다.
* Silent Refresh 지원

![image](https://user-images.githubusercontent.com/16472109/117815252-3d6d0b00-b2a0-11eb-991a-729f5fda8895.png)
그림 출처 : https://bit.ly/3o5MdbT

**3. 역할 기반 접근 제어([Role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control))**
* 권한(Permission)을 직접 만들 수 있으며 여러 역할(Role)에 할당 할 수 있다.
* 또한 사용자에게 여러 역할을 할당할 수 있다.
* 권한에 따라 접근할 수 있는 화면 메뉴를 제어할 수 있다.

![image](https://user-images.githubusercontent.com/16472109/117816086-195df980-b2a1-11eb-99e9-7fc976d78311.png)

![image](https://user-images.githubusercontent.com/16472109/117816115-20850780-b2a1-11eb-8061-155932db64a4.png)

![image](https://user-images.githubusercontent.com/16472109/117816128-25e25200-b2a1-11eb-8675-340eb493dcec.png)

**4. 두레이 인증 지원**

![image](https://user-images.githubusercontent.com/16472109/117816485-84a7cb80-b2a1-11eb-91e3-67815d3fe500.png)

![image](https://user-images.githubusercontent.com/16472109/117816154-2e3a8d00-b2a1-11eb-93f2-f4b7c971c7bf.png)


## 시작하기

### Front-end Service
```bash
$ npm install
$ npm start
```

혹은

```bash
$ yarn install
$ yarn start
```

### Back-end Service
```
docker pull bettercode2016/better-admin-backend-service
docker run -d -p 2016:2016 bettercode2016/better-admin-backend-service
```

혹은 https://github.com/bettercode-oss/better-ADMIN-backend-service 코드를 체크아웃 받아 실행
