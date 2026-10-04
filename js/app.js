// 案例复现：迷你版校园信息中心
(function () {
  'use strict';

  // ===== 数据加载（含错误处理三状态：断网/空数据/格式错）=====
  var DATA_URL = 'data/data.json';
  var data = { rooms: [] };

  const statusText = { 开放: '开放（可预约）', 暂停: '临时暂停', 满员: '已满员' };

  function renderHomeCards(len) {
    var cards = [
      { title: '自修室查询', desc: '按楼层与开放状态快速筛选' },
      { title: '使用统计', desc: 'ECharts 柱状图展示使用量' },
      { title: '校园三维', desc: 'A-Frame 校园导览（打开子页面）' }
    ];
    $('#homeCards').html(cards.map(function (c) {
      return '<div class="col"><div class="card h-100"><div class="card-img-placeholder">' + c.title +
        '</div><div class="card-body"><p class="card-text">' + c.desc + '</p></div></div></div>';
    }).join(''));
  }

  // 渲染自习室列表；render 前先清空容器，避免筛选后残留旧数据
  function renderRooms(list) {
    var $list = $('#roomList');
    $list.empty();
    var arr = list || [];
    if (arr.length === 0) {
      $('#emptyTip').css('display', 'block');
      return;
    }
    $('#emptyTip').css('display', 'none');
    arr.forEach(function (r) {
      var html = '<div class="col"><div class="card room-card h-100">' +
        '<div class="card-body">' +
        '<h6 class="card-title">' + r.name + '</h6>' +
        '<span class="status-badge status-' + r.status + '">' + statusText[r.status] + '</span>' +
        '<p class="card-text small mt-2">' + r['campus'] + ' · ' + r['floor'] + '层 · 容量' + r.capacity +
        ' · 当前使用' + r.usage + '人</p>' +
        '</div></div></div>';
      $list.append(html);
    });
  }

  function applyFilter() {
    var floor = $('#floorSel').val();
    var status = $('#statusSel').val();
    var rows = data.rooms.filter(function (r) {
      var okFloor = floor === 'all' || String(r['floor']) === floor;
      var okStatus = status === 'all' || r.status === status;
      return okFloor && okStatus;
    });
    renderRooms(rows);
  }

  // 渲染 ECharts 柱状图（同一容器只初始化一次）
  var chart = null;
  function renderChart() {
    var el = document.getElementById('usageChart');
    if (!el) { return; }
    if (!chart) {
      chart = echarts.init(el);
    } else {
      chart.clear();
    }
    chart.setOption({
      title: { text: '各自习室当前使用量（单位：人）', left: 'center' },
      tooltip: { trigger: 'axis' },
      grid: { containLabel: true },
      xAxis: { type: 'category', data: data.rooms.map(r => r.name), axisLabel: { interval: 0, rotate: 20 } },
      yAxis: { type: 'value', name: '使用人数' },
      series: [{
        name: '使用量', type: 'bar', data: data.rooms.map(r => r.usage),
        itemStyle: { color: '#2b6cb0' }, label: { show: true, position: 'top' }
      }]
    });
  }

  function loadData() {
    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        return res.json();
      })
      .then(function (json) {
        data = json || { rooms: [] };
        var empty = !data.rooms || data.rooms.length === 0;
        $('#failTips').addClass('d-none');
        renderHomeCards(data.rooms.length);
        renderRooms(data.rooms);
        renderChart();
        if (empty) {
          $('#failTips').removeClass('d-none').text('数据为空：暂无自习室数据。');
        }
      })
      .catch(function (err) {
        console.error('数据加载失败：', err);
        $('#failTips').removeClass('d-none').text('网络异常或数据加载失败，请稍后再试。');
        renderRooms([]);
      });
  }

  // 页面内锚点导航高亮当前项
  function bindNav() {
    $('#navList .nav-link[href^="#"]').on('click', function () {
      $('#navList .nav-link').removeClass('active');
      $(this).addClass('active');
    });
  }

  function bindEvents() {
    bindNav();
    // 筛选：使用事件委托，任何选择变化都刷新
    $('#filterForm').on('change', 'select', applyFilter);
    $('#resetBtn').on('click', function () {
      $('#floorSel').val('all');
      $('#statusSel').val('all');
      applyFilter();
    });
  }

  $(function () {
    bindEvents();
    loadData();
    // 窗口尺寸变化时图表自适应
    window.addEventListener('resize', function () {
      if (chart) { chart.resize(); }
    });
  });
})();