# 행성 피하기 게임

### AVOID_PLANET

---

## 게임소개

**시나리오**

- 우주에 미아가된 우주선이 지구로 돌아가기위해 여행을 하는 게임입니다.
- 플레이어 = 우주선

## 조작법

- Space를 누르고있으면 올라갑니다.
- Space를 때면 내려갑니다.
- c 를 누르면 기를 모읍니다.
- x 를 누르면 방패를 들어올립니다.

## 구현기능

- 스테이지 구분 
1.기존 점수에서 지정점수에 도달할 떄 마다 스테이지가 변동된다.
2.스테이지가 상승할때마다 화면 가운데 현재 스테이지를 텍스트로 출력한 후 1.5초후 사라지도록 작성
3.별도로 왼쪽위에 현재 스테이지 표시

- 스테이지에 따른 점수 획득 구분
스테이지가 올라갈수록 점수가 기존점수상승치+추가점수 로 상승한다.

 - 스테이지에 따라 아이템이 생성
스테이지가 올라갈때마다 새로운 아이템을 추가로 생성한다.

- 아이템 획득시 점수 획득
유저가 아이템을 획득할시 점수가 올라간다.

- 아이템 별 획득 점수 구분
어떤 아이템을 획득했냐에 따라 상승치가 다르게 적용된다.

- 장애물 랜덤 스폰
장애물이 랜덤한 좌표로 랜덤하게 스폰되도록 구현



