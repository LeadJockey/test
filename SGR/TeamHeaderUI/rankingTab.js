import RowMarker from './highlightTableRow';

export default ($rankingTab, $ctx, state, setState) => {
  const $tables = $rankingTab.children('.tbl_score');
  const rowMarker = new RowMarker($rankingTab, $tables, '.select_team');

  init();

  function init() {
    setInitialState();
    render();
  }

  function setInitialState() {
    const $tableRows = $ctx.find('.tbl_playing tbody tr');
    const $teamRank = $tableRows.filter('.select_team');
    const teamRankIdx = $teamRank.index();

    setState({
      action: 'init',
      selectTeamIdx: teamRankIdx,
      fold: true
    });
  }

  function TeamMarker(state) {
    const $tableRows = $ctx.find('.tbl_playing tbody');
    rowMarker.changeTable($tableRows);

    const targetIndex = rowMarker.$targetRow.index();
    const isOnTheList = targetIndex > -1;
    const isLowRank = targetIndex > 9;
    const isHighRank = isOnTheList && !isLowRank;
    const shouldRender = isOnTheList && (isHighRank || isLowRank && !state.fold);

    if (shouldRender) {
      rowMarker.render();
      rowMarker.setMarkerPos();
    }
  }

  function render() {
    TeamMarker(state);
  }

  return render;
};