## Information
##### 노출코드
- 구단 (SGR)

##### 대표쿼리
하단 링크 참고

http://jira.daumkakao.com/browse/SRCHCP-7735



## definition
- 메인 및 서브탭
- 구단명 클릭시 타 구단 셀렉트박
- 검색한 구단명 하이라이팅
- 페이징기능
- 경기시간 체크
- 해외리그) 내셔널리그 / 아메리칸 리그 등 테이블 filter 기능




## instructions
state에 {이름: 값}으로 저장후 state만 업데이트하는 방식으로 사용된다.

state를 업데이트 해주는 stateSetter

기존과 같은 이름이면 업데이트, 새로 만들어진 이름이면 새로 추가된다.



## state
```js
const state = {
  tabName: $.trim($initialActiveTabItem.text()),
  tabIdx: $initialActiveTabItem.index(),
  teamRankingTab: {
    subTabIndex: 0,
    league: '',
    district: '',
    fold: true,
    leagueparam: ''
  }
 }
```




|  Name | Type  | DESC | Default |
|-------|-------|-------|-------|
|tabName | string | 선택된 대메뉴 탭명 | 첫번째 탭( =마크업에서 처음 on 클래스가 붙어있는 탭 ) |
| tabIdx | number | 선택된 대메뉴 index | 첫번째 탭( =마크업에서 처음 on 클래스가 붙어있는 탭 ) |
| scheduleTab | - | 일정 |  |
| rankingTab | - | 구단순위 |  |


#### scheduleTab - 일정
|  Name | Type  | DESC | Default |
|-------|-------|-------|-------|
|schedulePageIndex | number | 페이지 idx | 0 |

#### rankingTab - 구단순위
|  Name | Type  | DESC | Default |
|-------|-------|-------|-------|
|league | string | data-attr | ' ' |
|fold | bool | 펼쳐보기 여부 | true |
|teamRankIdx | number | 팀랭크 idx | -1 |
|btnClicked | bool | 버튼 클릭 여부 | false |
|action | string | 실행 메서드 | ' '  |
|leagueparam | string | data-attr | ' ' |



## Other
```
isTeamHeaderUI : KBO 와 일반리그 구별함
- KBO : TeamHeaderUI
- 외 : CommonHeaderUI
```
