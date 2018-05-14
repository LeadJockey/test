import $ from 'jquery';

function RowMarker($ctx, $table, targetRowSelector) {
  this.$ctx = $ctx;
  this.$marker = $('<span class="play_select"></span>');
  this.targetRowSelector = targetRowSelector;
  this.$targetRow = $table.find(targetRowSelector);
}

RowMarker.prototype = {
  hasTarget() {
    return !!this.$targetRow.get(0);
  },

  changeTable($newTable) {
    this.$targetRow = $newTable.find(this.targetRowSelector);
  },

  render() {
    this.hasTarget() && this.$ctx.append(this.$marker);
  },

  remove() {
    this.$marker.remove();
  },

  setMarkerPos() {
    this.hasTarget() && this.$marker.offset({top: this.$targetRow.offset().top});
  },

  init() {
    this.render();
    this.setMarkerPos();
  }
};

export default RowMarker;