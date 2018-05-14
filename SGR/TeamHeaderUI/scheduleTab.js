import $ from 'jquery';
import pagenumTemplate from '../pagenum.hbs';

export default ($panel, $ctx, state, setState) => {
  const $gameListWrap = $ctx.find('.wrap_sports');
  const $pageNavWrap = $panel.find('.paging_comm');
  const $pagingArea = $pageNavWrap.find('.paging_inner');
  const $gamePages = $gameListWrap.find('.list_game');
  const template = $.templates(pagenumTemplate);

  bindPageNumEvent();

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
        schedulePageIndex: state.schedulePageIndex + step
      });
    });
  }

  function SubSchedulePage(state) {
    $gamePages.addClass('hide');
    $gamePages.eq(state.schedulePageIndex).removeClass('hide');
  }

  function PageNavigation(state) {
    const p = state.schedulePageIndex + 1;
    const numberItems = $pagingArea.find('[data-p]').map((idx, el) => ({ isCurrentPage: $(el).data('p') === p, dataP: $(el).data('p') })).get();
    const html = template.render({
      p,
      numberItems
    });
    $pagingArea.html(html);
  }

  function render() {
    SubSchedulePage(state);
    PageNavigation(state);
  }

  return render;
};