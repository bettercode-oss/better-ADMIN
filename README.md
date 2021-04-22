# better ADMIN ✨

## 배경

Admin 화면을 만들면 매번 아래와 같은 기능을 구현한다.

* Layout
  * Header, Footer, Contents
  * 메뉴 Navication
    * GNB(Global Navication Bar)
    * LNB(Local Navigation Bar)
    * SNB(Side Navigation Bar)
* 사용자 인증
  * 로그인
  * 로그아웃
* 사용자 권한 관리
  * 권한에 따른 메뉴 사용 여부


## 지원하는 기능
* Ant Design을 기반으로 하는 Layout을 자동 생성
* Config 파일을 통한 메뉴 생성
* 두레이 로그인

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

![image](https://user-images.githubusercontent.com/16472109/115780456-2602d680-a3f4-11eb-949b-884834dab728.png)


![image](https://user-images.githubusercontent.com/16472109/113784793-f9eb2280-9770-11eb-8d78-deea642fa855.png)



