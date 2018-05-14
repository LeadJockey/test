import $ from 'jquery';
import pagenumTemplate from '../pagenum.hbs';


export default ($panel, $ctx, state, setState) => {

  const $template = $.templates(pagenumTemplate);
  const $gamePageWrap = $panel.find('.wrap_sports');
  const $gamePages = $gamePageWrap.find('.list_game');
  const $pagingArea = $panel.find('.paging_inner');

  setInitialState();
  bindPageNumEvent();

  function setInitialState() {
    setState({
      schedulePageIndex: $gamePageWrap.find('.list_game').not('.hide').index()
    });
  }

  function render() {
    PageNavigation(state.scheduleTab);
    GameListPage(state.scheduleTab);
  }

  function bindPageNumEvent() {
    // 숫자 버튼
    $pagingArea.on('click', 'a[data-p]', function() {
      setState({
        schedulePageIndex: $(this).data('p') - 1
      });
    });

    // 이전/다음 버튼
    $pagingArea.on('click', 'a.btn_page:not([data-p])', function() {
      const isToNext = $(this).hasClass('btn_next');
      const step = isToNext ? 1 : -1;
      setState({
        schedulePageIndex: state.scheduleTab.schedulePageIndex + step
      });
    });
  }

  function PageNavigation(state) {
    const p = state.schedulePageIndex + 1;
    const numberItems = $pagingArea.find('[data-p]').map((idx, el) => ({ isCurrentPage: $(el).data('p') === p, dataP: $(el).data('p') })).get();
    const html = $template.render({
      p,
      numberItems
    });
    $pagingArea.html(html);
  }

  function GameListPage(state) {
    $gamePages.addClass('hide').eq(state.schedulePageIndex).removeClass('hide');
  }

  return render;
};