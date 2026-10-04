// 自主实践：校园社团活动中心
(function () {
  'use strict';

  var DATA_URL = 'data/activities.json';
  var STORE_KEY = 'campus_activity_apply';   // localStorage 键
  var data = { activities: [] };
  var applies = loadApplies();

  function loadApplies() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function saveApplies() {
    localStorage.setItem(STORE_KEY, JSON.stringify(applies));
  }

  function renderActivityList(arr) {
    var $list = $('#actList');
    $list.empty();
    if (!arr || arr.length === 0) {
      $('#applyEmpty').css('display', 'block');
      return;
    }
    $('#applyEmpty').css('display', 'none');
    var pct = function (a) { return Math.round(a.joined / a.limit * 100); };
    arr.forEach(function (a) {
      var html =
        '<div class="col"><div class="card act-card h-100">' +
        '<div class="card-body">' +
        '<div class="d-flex justify-content-between align-items-start">' +
        '<h6 class="card-title">' + a.name + '</h6>' +
        '<span class="cat-badge">' + a.category + '</span></div>' +
        '<p class="card-text small text-muted mb-1">' + a.place + ' · ' + a.date + '</p>' +
        '<div class="d-flex justify-content-between small mb-1"><span>已报名 ' + a.joined + '/' + a.limit + '</span>' +
        '<span>' + pct(a) + '%</span></div>' +
        '<div class="progress progress-thin"><div class="progress-bar" style="width:' + pct(a) +
        '%"></div></div>' +
        '</div></div></div>';
      $list.append(html);
    });
  }

  function applyFilter() {
    var cat = $('#catSel').val();
    var kw = ($('#kwInput').val() || '').trim().toLowerCase();
    var rows = data.activities.filter(function (a) {
      var okCat = cat === 'all' || a.category === cat;
      var okKw = kw === '' || a.name.toLowerCase().indexOf(kw) > -1 || a.place.toLowerCase().indexOf(kw) > -1;
      return okCat && okKw;
    });
    renderActivityList(rows);
  }

  function renderApplies() {
    var $list = $('#applyList');
    $list.empty();
    if (applies.length === 0) {
      $('#applyTip').css('display', 'block');
      return;
    }
    $('#applyTip').css('display', 'none');
    applies.forEach(function (ap, idx) {
      var act = data.activities.find(function (a) { return a.id == ap.activityId; });
      var html =
        '<div class="col"><div class="card h-100"><div class="card-body">' +
        '<h6 class="card-title">' + (act ? act.name : ('活动#' + ap.activityId)) + '</h6>' +
        '<p class="card-text small">' + ap.name + '（学号：' + ap.studentNo + '）</p>' +
        '<button class="btn btn-sm btn-outline-danger" data-idx="' + idx + '">取消报名</button>' +
        '</div></div></div>';
      $list.append(html);
    });
  }

  function renderChart() {
    var el = document.getElementById('statChart');
    if (!el) { return; }
    var cats = [];
    data.activities.forEach(function (a) {
      if (cats.indexOf(a.category) < 0) { cats.push(a.category); }
    });
    var count = cats.map(function (c) {
      return data.activities.filter(function (a) { return a.category === c; }).length;
    });
    var joined = cats.map(function (c) {
      return data.activities.filter(function (a) { return a.category === c; })
        .reduce(function (s, a) { return s + a.joined; }, 0);
    });

    if (window.__statChart) { window.__statChart.dispose(); }
    window.__statChart = echarts.init(el);
    window.__statChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['活动数量', '累计报名人数'], top: 0 },
      grid: { containLabel: true, left: '6%', right: '6%' },
      xAxis: { type: 'category', data: cats },
      yAxis: [
        { type: 'value', name: '活动数量' },
        { type: 'value', name: '报名人数' }
      ],
      series: [
        { name: '活动数量', type: 'bar', data: count, itemStyle: { color: '#00897b' } },
        { name: '累计报名人数', type: 'line', yAxisIndex: 1, data: joined, itemStyle: { color: '#f57c00' } }
      ]
    });
  }

  function loadData() {
    fetch(DATA_URL)
      .then(function (res) { if (!res.ok) { throw new Error('HTTP ' + res.status); } return res.json(); })
      .then(function (json) {
        data = json || { activities: [] };
        $('#failTips').addClass('d-none');
        // 填充类别与活动下拉，下拉内容在数据加载后再填，避免空选
        var cats = [];
        data.activities.forEach(function (a) { if (cats.indexOf(a.category) < 0) { cats.push(a.category); } });
        $('#catSel').append(cats.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join(''));
        $('#actSel').append(data.activities.map(function (a) { return '<option value="' + a.id + '">' + a.name + '</option>'; }).join(''));
        if (!data.activities.length) {
          $('#failTips').removeClass('d-none').text('数据为空：暂无活动可展示。');
        }
        renderActivityList(data.activities);
        renderApplies();
        renderChart();
      })
      .catch(function (err) {
        console.error('数据加载失败：', err);
        $('#failTips').removeClass('d-none').text('网络异常或数据加载失败，活动暂时无法展示。');
        renderActivityList([]);
      });
  }

  function bindEvents() {
    // 筛选：事件委托，任何变化即时刷新
    $('#activities').on('change', '#catSel', applyFilter);
    $('#activities').on('input', '#kwInput', applyFilter);

    // 报名表单提交
    $('#applyForm').on('submit', function (ev) {
      ev.preventDefault();
      var aid = parseInt($('#actSel').val(), 10);
      var name = $('#stuName').val().trim();
      var no = $('#stuNo').val().trim();
      if (!name || !no) { $('#failTips').removeClass('d-none').text('请填写姓名和学号。'); return; }
      var exists = applies.some(function (ap) { return ap.activityId === aid && ap.studentNo === no; });
      if (exists) { $('#failTips').removeClass('d-none').text('该学号已报名此活动，请勿重复报名。'); return; }
      applies.push({ activityId: aid, name: name, studentNo: no, time: Date.now() });
      saveApplies();
      $('#failTips').addClass('d-none');
      $('#stuName').val(''); $('#stuNo').val('');
      renderApplies();
    });

    // 取消报名（事件委托）
    $('#applyList').on('click', '[data-idx]', function () {
      var idx = parseInt($(this).data('idx'), 10);
      applies.splice(idx, 1);
      saveApplies();
      renderApplies();
    });
  }

  $(function () {
    bindEvents();
    loadData();
    window.addEventListener('resize', function () {
      if (window.__statChart) { window.__statChart.resize(); }
    });
  });
})();