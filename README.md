# Better Admin
Better Admin은 [Purple Admin UI](https://github.com/purpleio/purple-admin-ui) 기반으로 사용자 인증/인가를 위한 역할 기반 접근 제어를 지원하는 Admin 템플릿이다.

## 주요 기능
* 기본 인증 및 사용자 관리 기능이 내장 되어 있다.
* [역할 기반 접근 제어(Role-Based Access Control)](https://en.wikipedia.org/wiki/Role-based_access_control) 모델을 지원한다.
* [Auth.js](https://authjs.dev/)를 기반으로 신뢰할 수 있고 안전한 인증을 제공한다.

## 동작 화면
![image](https://github.com/bettercode-oss/better-ADMIN/assets/16472109/cfa6ab01-8cd4-45ee-b0c0-31c82555fe50)
![image](https://github.com/bettercode-oss/better-ADMIN/assets/16472109/ee604a21-8d36-48da-ad11-d445460262d7)
![image](https://github.com/bettercode-oss/better-ADMIN/assets/16472109/516fc7c4-cfde-4bca-861a-94b45d95a0f6)
![image](https://github.com/bettercode-oss/better-ADMIN/assets/16472109/85f4fa61-1072-43aa-b813-9e4017ba6b60)
![image](https://github.com/bettercode-oss/better-ADMIN/assets/16472109/6057b36e-d88a-43dd-9b4f-def4ea9bde20)
![image](https://github.com/bettercode-oss/better-ADMIN/assets/16472109/0b9c4137-62f4-4790-8ccd-a7c4779b05a0)
![image](https://github.com/bettercode-oss/better-ADMIN/assets/16472109/0b336343-8ebb-42f6-90b0-e119f4b2a496)
![image](https://github.com/bettercode-oss/better-ADMIN/assets/16472109/7ece84bd-189b-4cbb-9f2e-637b89f063e3)

## 시작하기
### Front-end Service
```bash
$ npm install
$ npm run dev
```

### Back-end Service
```
docker pull bettercode2016/better-admin-backend-service
docker run -d -p 2016:2016 bettercode2016/better-admin-backend-service
```

혹은

https://github.com/bettercode-oss/better-ADMIN-backend-service 코드를 체크아웃 받아 실행

### 테스트 ID/Password
siteadm/123456