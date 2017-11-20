<script>
  console.log(document);
  console.log(window);
  console.log(document.getElementById('target'));
  document.getElementById('target').addEventListener('click', function () {
    alert('와씨 이거 땜에 5분 멍... document.getElementById("#target")')
  });
</script>