## Emergency Time 재난 실시간 상황 공유 서비스(위치 기반 실시간 영상 스트리밍)

재난 상황이 발생하면 기존 방식으로는 재난 상황 공유에 대한 문제점을 해결하기 힘드므로 누구나 위치에 기반해 실시간 방송을 진행하고, 방송이 끝난 영상에 대해서는 다시보기를 제공해 정확한 현장 상황을 알 수 있도록 서비스를 개발했습니다.

또한 지도에 CCTV 영상을 추가해 보고 싶은 지역의 방송이 없는 경우에도 간접적으로나마 정보를 얻을 수 있도록 했습니다.

또한 다시보기 영상의 경우 초상권 침해를 막기 위해서 방송이 끝나면 영상에 나오는 사람들의 얼굴을 블러 처리 한 후 영상을 다시 볼 수 있도록 했습니다.

## 발표 자료 

http://bit.ly/3GtTdtw

## 프론트 아키텍처
<img width="1153" alt="image" src="https://user-images.githubusercontent.com/46379947/230796787-e830c2f7-d995-4607-98b5-102bc89e34a3.png">

### Pain Point
- 프론트 개발자가 없음
- 빠른 서비스 구현을 위해 높은 생산성 요구
- 순간적인 부하를 잘 견딜 수 있어야 함
- 지연 시간이 적고 저비용의 실시간 방송 솔루션 필요
### Solution
- Amplify
  - 제공되는 React UI를 이용한 빠른 개발
  - Amazon Location Service와 함께 사용해서 빠르고 간편한 지도 서비스 개발
  - 기본적으로 지원되는 자동화된 CI / CD
- CloudFront
  - 캐시를 통해 빠른 콘텐츠 전달 가능
  - 순간적으로 부하가 몰리는 상황에도 안정적으로 콘텐츠 제공 가능
- Amazon Location Service
  - 저비용의 빠른 지도 서비스 개발
- Interactive Video Service
  - 제공되는 SDK를 통해 브라우저에서 바로 실시간 방송 가능
  - 같이 제공되는 Player SDK를 통해 실시간 방송 재생 가능


## 백엔드 아키텍처
<img width="1156" alt="image" src="https://user-images.githubusercontent.com/46379947/230796863-fc6434e1-4049-42c2-bddd-e81fe69966a7.png">

### Pain Point
- Live 방송 서비스 및 영상 저장&재생을 위해서는 Media 처리 분야에 전문지식이 필요하며 방대한 서비스 구축 필요
- Live 방송, 시청자 수, 서비스 사용자 수를 예측할 수 없는 환경에서 traffic 처리를 위해 scalable 하면서도 비용 효율적인 Architecture가 필요했음.
- AWS Console 통해서 수작업으로 구축 시 재사용성이 떨어짐
### Solution
- Interactive Video Service는 관리형 라이브 스트리밍 솔루션으로 Media 처리를 처음 접해도 쉽게 활용 가능
  - 라이브 동영상을 제공하는 데 필요한 모든 작업을 처리해 주며, 방송이 끝난 영상과 썸네일을 S3에 저장하여 다시 활용할 수 있음
  - 사용한 만큼만 비용 지불
  - 지연 시간 평균 5초 미만, 최대 10초
- 완전 관리형 Serverless 서비스이면서 사용한 만큼 지불하고 오토스케일링이 가능한 API Gateway, Lambda, DynamoDB 활용
- SAM (Serverless Application Model) 활용하여 재사용성 강화

## 서버리스 Media Blur 아키텍처
<img width="1162" alt="image" src="https://user-images.githubusercontent.com/46379947/230796902-9ef75988-1b15-4e79-a55c-609f4b45c954.png">

### Pain Point
- 특정 시기에만 많이 올라오는 traffic 처리를 위해 scalable 하면서도 비용 효율적인 Architecture가 필요했음.
### Solution
- 완전관리형 Serverless 서비스 및 native trigger 기능 들만을 이용하여 실시간 영상 얼굴 blur 처리 기능 개발
- User가 Live 종료 후 빠르면 10~15초 이내 blur 영상 serving (크기에 따라 상이)
- Step Functions State machine을 이용하여 복잡한 micro service workflow 관리

<img width="148" alt="image" src="https://user-images.githubusercontent.com/46379947/230796928-0ec85871-ab1b-45b4-b5c5-f7da94cb8bc3.png">



## 서비스 사진

### 지도 
<img width="333" alt="image" src="https://user-images.githubusercontent.com/46379947/230796993-312c596d-c9e9-42ad-b9d6-12fd1da07680.png"

- 지도 위에 다양한 종류의 영상 노출
  - 마커 : 라이브 방송
  - 썸네일 : 처리 중인 영상 혹은 저장된 영상
  - 카메라 마커 : CCTV

### CCTV 영상 확인
https://user-images.githubusercontent.com/46379947/230797166-9431c868-4b17-4f48-81cd-3f39c9b5308c.mp4


### 방송 전 Preview 화면
https://user-images.githubusercontent.com/46379947/230797085-3efe8eb0-e6e9-4fc4-9afd-3c61ff44eb2f.mp4


### 실시간 방송 화면
https://user-images.githubusercontent.com/46379947/230797107-dbfdcd6f-2a1f-4516-867d-40aa87bb297f.mp4


### 저장된 영상
https://user-images.githubusercontent.com/46379947/230797167-d21420f0-11c4-4760-a07c-5e495b4cea59.mp4


### 사람의 얼굴이 블러 처리된 영상
https://user-images.githubusercontent.com/46379947/230797185-b26f47df-d952-4339-922a-e71263401c97.mp4








