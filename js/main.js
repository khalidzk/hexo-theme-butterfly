$(function () {
  const is_Snackbar = GLOBAL_CONFIG.Snackbar !== undefined ? true : false

  /**
   * 當menu過多時，自動適配，避免UI錯亂
   */
  const search_width = $('#search_button').outerWidth()
  const blogName_width = $('#blog_name').width()

  var mw = 0;
  for (var i = 0; i < $('#page-header .menus_item').length; i++) {
    mw = mw + $('#page-header .menus_item').eq(i).outerWidth()
  }

  $('#page-header').height() > 45 ? header_adjust() : ''

  function header_adjust() {
    $("#page-header .toggle-menu").addClass("is_visible")
    $("#page-header .menus,.search span").addClass("is_invisible")
  }

  function header_adjust_back() {
    $("#page-header .toggle-menu").removeClass("is_visible")
    $("#page-header .menus,.search span").removeClass("is_invisible")
  }

  /**
   * 傳入 1 sidebar打開時
   * 傳入 2 正常狀態下
   * 傳入 3 resize時使用
   */
  function is_adjust(n) {
    var t;
    if (n == '1') {
      t = blogName_width + search_width + mw > $("#page-header").width() - 300 ? true : false
    } else if (n == '2') {
      t = blogName_width + search_width + mw > $("#page-header").width() ? true : false
    } else if (n == "3") {
      t = blogName_width + search_width + mw > $("#page-header").width() ? true : false
    }
    if (t) {
      header_adjust()
    } else {
      header_adjust_back()
    }
  }

  $(window).bind("resize", function () {
    if (window.innerWidth > 768) {
      is_adjust(3)
    } else {
      header_adjust()
    }
  })

  $('#page-header').css({
    'opacity': '1',
    'animation': 'headerNoOpacity .7s'
  })

  /**
   * pc時 設置主頁top_img 為 fixed
   */
  if (GLOBAL_CONFIG.isHome) {
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {} else {
      $('.full_page .nav_bg').css('background-attachment', 'fixed');
    }
  }


  /**
   * 進入post頁sidebar自動打開
   */
  if ($('#sidebar').hasClass('auto_open')) {
    if ($(".sidebar-toc__content").children().length > 0) {
      $('#toggle-sidebar').addClass('on')
      setTimeout(function () {
        $("#toggle-sidebar").addClass('on');
        open_sidebar()
      }, 400);
      is_adjust(1)

    } else
      $("#toggle-sidebar").css("display", "none")
  } else {
    $('#toggle-sidebar').css('opacity', '1')
  }


  /**
   * 點擊左下角箭頭,顯示sidebar
   */

  function close_sidebar() {
    $('#page-header').removeClass('open-sidebar')
    $('body').animate({
      paddingLeft: 0
    }, 400)
    $('#sidebar').css('transform', 'translateX(0px)')
    $('#toggle-sidebar').css({
      'transform': 'rotateZ(0deg)',
      'color': '#1F2D3D',
      'opacity': "1"
    })
  }

  function open_sidebar() {
    $('#page-header').addClass('open-sidebar')
    $('body').animate({
      paddingLeft: 300
    }, 400)

    $('#sidebar').animate({}, function () {
      $('#sidebar').css('transform', 'translateX(300px)')
    })


    $('#toggle-sidebar').animate({}, function () {
      $('#toggle-sidebar').css({
        'transform': 'rotateZ(180deg)',
        'color': '#99a9bf',
        'opacity': "1"
      })
    })

  }
  $('#toggle-sidebar').on('click', function () {

    if (!isMobile() && $('#sidebar').is(':visible')) {
      var isOpen = $(this).hasClass('on')
      isOpen ? $(this).removeClass('on') : $(this).addClass('on')
      if (isOpen) {
        close_sidebar()
        setTimeout(function () {
          is_adjust(2)
        }, 500)
      } else {
        is_adjust(1)
        open_sidebar()
      }
    }
  })


  /**
   * 首頁top_img底下的箭頭
   */
  $(".scroll-down").on("click", function () {
    scrollTo('#content-outer')
  });


  /**
   * BOOKMARK 書簽
   */
  $('#bookmark-it').on("click", function () {
    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
      window.external.AddFavorite(location.href, document.title);
    } else if (window.opera && window.print) { // Opera Hotlist
      this.title = document.title;
      return true;
    } else { // webkit - safari/chrome     
      if (is_Snackbar) {
        var bookmarkText = GLOBAL_CONFIG.Snackbar.bookmark.message_prev + ' ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + '+ D ' + GLOBAL_CONFIG.Snackbar.bookmark.message_next + '.';
        snackbarShow(bookmarkText)
      } else {
        alert(GLOBAL_CONFIG.bookmark.message_prev + ' ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + '+ D ' + GLOBAL_CONFIG.bookmark.message_next + '.');
      }
    }
  });

  /**
   * 代碼copy
   * copy function
   */

  function copy(text, ctx) {
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      try {
        document.execCommand('copy') // Security exception may be thrown by some browsers.
        if (is_Snackbar) {
          snackbarShow(GLOBAL_CONFIG.copy.success)
        } else {
          $(ctx).prev('.copy-notice')
            .text(GLOBAL_CONFIG.copy.success)
            .animate({
              opacity: 1,
              right: 30
            }, 450, function () {
              setTimeout(function () {
                $(ctx).prev('.copy-notice').animate({
                  opacity: 0,
                  right: 0
                }, 650)
              }, 400)
            })
        }
      } catch (ex) {
        if (is_Snackbar) {
          snackbarShow(GLOBAL_CONFIG.copy.success)
        } else {
          $(ctx).prev('.copy-notice')
            .text(GLOBAL_CONFIG.copy.error)
            .animate({
              opacity: 1,
              right: 30
            }, 650, function () {
              setTimeout(function () {
                $(ctx).prev('.copy-notice').animate({
                  opacity: 0,
                  right: 0
                }, 650)
              }, 400)
            })
          return false
        }
      }
    } else {
      if (is_Snackbar) {
        snackbarShow(GLOBAL_CONFIG.copy.noSupport)
      } else {
        $(ctx).prev('.copy-notice').text(GLOBAL_CONFIG.copy.noSupport)
      }
    }
  }
  // click events
  $(document).on('click', '.code-area-wrap .fa-clipboard', function () {
    var selection = window.getSelection()
    var range = document.createRange()
    range.selectNodeContents($(this).parent().siblings('figure').find('.code pre')[0])
    selection.removeAllRanges()
    selection.addRange(range)
    var text = selection.toString()
    copy(text, this)
    selection.removeAllRanges()
  })

  /**
   * 代碼收縮
   */
  $(document).on('click', '.code-area-wrap .code-expand', function () {
    var $figure = $(this).parent().next()
    if ($(this).hasClass('code-closed')) {
      $figure.slideDown(300)
      $(this).removeClass('code-closed');
    } else {
      $figure.slideUp(300)
      $(this).addClass('code-closed');
    }
  })

  /**
   * fancybox和 medium_zoom 
   */

  var medium_zoom = GLOBAL_CONFIG.medium_zoom;
  var fancybox = GLOBAL_CONFIG.fancybox;
  if (fancybox) {
    $().fancybox({
      selector: "[data-fancybox]",
      loop: true,
      transitionEffect: "slide",
      protect: true,
      // wheel: false,
      buttons: ["slideShow", "fullScreen", "thumbs", "close"]
    });
  }
  if (medium_zoom) {
    const zoom = mediumZoom(document.querySelectorAll('.mediumZoom'))
    zoom.on('open', event => {
      let photoBg = $(document.documentElement).attr('data-theme') == 'dark' ? '#121212' : '#fff'
      zoom.update({
        background: photoBg
      })
    })
  }


  /**
   * 手機menu和toc按鈕點擊
   * 顯示menu和toc的sidebar
   */
  function openMobileSidebar(name) {
    $('body').css('overflow', 'hidden')
    $('#body-wrap').css('transform', 'translateX(-250px)')
    $('#page-header').css('transform', 'translateX(-250px)')
    $('#page-header.fixed.visible').css('transform', 'translate3d(-250px, 100%, 0)')
    $('#rightside').css('transform', 'translateX(-288px)')
    $('#menu_mask').fadeIn();

    if (name === 'menu'){
      $(".toggle-menu").removeClass("close").addClass("open");
      $('#mobile-sidebar-menus').css({'transform': 'translateX(-254px)'})
    }

    if (name === 'toc'){
      $("#mobile-toc-button").removeClass("close").addClass("open");
      $('#mobile-sidebar-toc').css('transform', 'translateX(-254px)')
    }
  }

  function closeMobileSidebar(name) {
    $('body').css('overflow', '')
    $('#body-wrap').css('transform', '')
    $('#page-header').css('transform', '')
    $('#page-header.fixed.visible').css('transform', '')
    $('#rightside').css('transform', 'translateX(-38px)')
    $('#menu_mask').fadeOut();

    if (name == 'menu'){
      $(".toggle-menu").removeClass("open").addClass("close");
      $('#mobile-sidebar-menus').css({'transform': 'translateX(0)'})
    }

    if (name == 'toc'){
      $("#mobile-toc-button").removeClass("open").addClass("close");
      $('#mobile-sidebar-toc').css('transform', '')
    }
  }

  $('.toggle-menu').on('click', function () {
    if ($(".toggle-menu").hasClass("close")) {      
      openMobileSidebar('menu')     
      if ($('#toggle-sidebar').hasClass('on')) {
        $('body').css('padding-left', '0')
        $('#sidebar').css('transform', '')
      }
    }
  })

  $('#mobile-toc-button').on('click', function () {
    if ($("#mobile-toc-button").hasClass("close")) openMobileSidebar(toc)
  })

  $('#menu_mask').on('click touchstart', function (e) {
    if ($(".toggle-menu").hasClass("open")) {
      closeMobileSidebar('menu')
      if ($('#toggle-sidebar').hasClass('on')) {
        setTimeout(function () {
          open_sidebar()
        }, 600)
      }
    }
    if ($("#mobile-toc-button").hasClass("open")) {
      closeMobileSidebar('toc')
    }
  })

  $(window).on('resize', function (e) {
    if (!$('.toggle-menu').is(':visible')) {
      if ($('.toggle-menu').hasClass('open')) closeMobileSidebar('menu')
    }
    if (!$('#mobile-toc-button').is(':visible')) {
      if ($("#mobile-toc-button").hasClass("open")) closeMobileSidebar('toc')
    }
  })

  //點擊toc，收起sidebar
  $("#mobile-sidebar-toc a").on('click', function () {
    closeMobileSidebar('toc')
  })

  /**
   *  scroll 滚动 toc
   */
  var initTop = 0
  $('.toc-child').hide()

  // main of scroll
  $(window).scroll(throttle(function (event) {
    var currentTop = $(this).scrollTop()
    if (!isMobile() && $(".sidebar-toc__content").children().length > 0) {
      // percentage inspired by hexo-theme-next
      scrollPercent(currentTop)
      // head position
      findHeadPosition(currentTop)
      auto_scroll_toc(currentTop)
    }
    var isUp = scrollDirection(currentTop)

    if (currentTop > 56) {
      if (isUp) {
        $('#page-header').hasClass('visible') ? $('#page-header').removeClass('visible') : ''

      } else {
        $('#page-header').hasClass('visible') ? '' : $('#page-header').addClass('visible')
      }
      $('#page-header').addClass('fixed')

      if ($('#rightside').css('opacity') === '0') {
        $('#rightside').animate({}, function () {
          $(this).css({
            'opacity': '1',
            'transform': 'translateX(-38px)'
          })
        })
      }
    } else {
      if (currentTop === 0) {
        $('#page-header').removeClass('fixed').removeClass('visible')
      }

      $('#rightside').animate({}, function () {
        $('#rightside').css({
          'opacity': '',
          'transform': ''
        })
      })

    }

  }, 300))

  // go up smooth scroll
  $('#go-up').on('click', function () {
    scrollTo('body')
  })

  // head scroll
  // $('#post-content').find('h1,h2,h3,h4,h5,h6').on('click', function (e) {
  //   scrollToHead('#' + $(this).attr('id'))
  // })

  // head scroll
  $('.toc-link').on('click', function (e) {
    e.preventDefault()
    scrollToHead($(this).attr('href'))
  })

  // find the scroll direction
  function scrollDirection(currentTop) {
    var result = currentTop > initTop // true is down & false is up
    initTop = currentTop
    return result
  }

  // scroll to a head(anchor)
  function scrollToHead(anchor) {
    scrollTo(anchor);
  }

  // expand toc-item
  function expandToc($item) {
    if ($item.is(':visible')) {
      return
    }
    $item.fadeIn(400)
  }

  function scrollPercent(currentTop) {
    var docHeight = $('#content-outer').height()
    var winHeight = $(window).height()
    var contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : ($(document).height() - winHeight)
    var scrollPercent = (currentTop) / (contentMath)
    var scrollPercentRounded = Math.round(scrollPercent * 100)
    var percentage = (scrollPercentRounded > 100) ? 100 : scrollPercentRounded
    $('.progress-num').text(percentage)
    $('.sidebar-toc__progress-bar').animate({
      width: percentage + '%'
    }, 100)
  }

  function updateAnchor(anchor) {
    if (window.history.replaceState && anchor !== window.location.hash) {
      window.history.replaceState(undefined, undefined, anchor)
    }
  }

  // find head position & add active class
  // DOM Hierarchy:
  // ol.toc > (li.toc-item, ...)
  // li.toc-item > (a.toc-link, ol.toc-child > (li.toc-item, ...))
  function findHeadPosition(top) {
    // assume that we are not in the post page if no TOC link be found,
    // thus no need to update the status
    if ($('.toc-link').length === 0) {
      return false
    }

    var list = $('#post-content').find('h1,h2,h3,h4,h5,h6')
    var currentId = ''
    list.each(function () {
      var head = $(this)
      if (top > head.offset().top - 25) {
        currentId = '#' + $(this).attr('id')
      }
    })

    if (currentId === '') {
      $('.toc-link').removeClass('active')
      $('.toc-child').hide()
    }

    var currentActive = $('.toc-link.active')
    if (currentId && currentActive.attr('href') !== currentId) {
      updateAnchor(currentId)

      $('.toc-link').removeClass('active')
      var _this = $('.toc-link[href="' + currentId + '"]')
      _this.addClass('active')

      var parents = _this.parents('.toc-child')
      // Returned list is in reverse order of the DOM elements
      // Thus `parents.last()` is the outermost .toc-child container
      // i.e. list of subsections
      var topLink = (parents.length > 0) ? parents.last() : _this
      expandToc(topLink.closest('.toc-item').find('.toc-child'))
      topLink
        // Find all top-level .toc-item containers, i.e. sections
        // excluding the currently active one
        .closest('.toc-item').siblings('.toc-item')
        // Hide their respective list of subsections
        .find('.toc-child').hide()
    }

  }

  function auto_scroll_toc(currentTop) {
    if ($('.toc-link').hasClass('active')) {
      var active_position = $(".active").offset().top;
      var sidebar_scrolltop = $("#sidebar").scrollTop();
      if (active_position > (currentTop + $(window).height() - 50)) {
        $("#sidebar").scrollTop(sidebar_scrolltop + 100);
      } else if (active_position < currentTop + 50) {
        $("#sidebar").scrollTop(sidebar_scrolltop - 100);
      }
    }
  }

  /**
   * 閲讀模式
   */
  $("#readmode").click(function () {
    var isDark = $(document.documentElement).attr('data-theme') === 'dark' ? true : false
    $('body').toggleClass('read-mode')
    $('#to_comment').toggleClass('is_invisible')

    if (Cookies.get("theme") == "dark") {
      if (isDark) $(document.documentElement).attr('data-theme', '')
      else $(document.documentElement).attr('data-theme', 'dark')
    }
  });

  /**
   * 字體調整
   */
  $("#font_plus").click(function () {
    var font_size_record = parseFloat($('body').css('font-size'))
    var pre_size_record = parseFloat($('pre').css('font-size'))
    var code_size_record = parseFloat($('code').css('font-size'))
    $('body').css('font-size', font_size_record + 1)
    $('pre').css('font-size', pre_size_record + 1)
    $('code').css('font-size', code_size_record + 1)
  });

  $("#font_minus").click(function () {
    var font_size_record = parseFloat($('body').css('font-size'))
    var pre_size_record = parseFloat($('pre').css('font-size'))
    var code_size_record = parseFloat($('code').css('font-size'))
    $('body').css('font-size', font_size_record - 1)
    $('pre').css('font-size', pre_size_record - 1)
    $('code').css('font-size', code_size_record - 1)
  });

  /**
   * sub-menus 位置調整
   */

  if ($(window).width() > 768) {
    $('.menus_item_child').each(function () {
      var a_width = $(this).siblings('a').outerWidth(true);
      var child_width = $(this).outerWidth(true);
      $(this).css("margin-left", -(child_width / 2 - a_width / 2))
    })
  }

  /**
   * 手機端sub-menu 展開/收縮
   */
  $('.menus-expand').on('click', function () {
    if ($(this).hasClass('menus-closed')) {
      $(this).parents('.menus_item').find('.menus_item_child').slideDown();
      $(this).removeClass('menus-closed');
    } else {
      $(this).parents('.menus_item').find('.menus_item_child').slideUp();
      $(this).addClass('menus-closed');
    }
  })

  /**
   * rightside 點擊設置 按鈕 展開
   */
  $('#rightside_config').on('click', function () {
    if ($('#rightside-config-hide').hasClass("rightside-in")) {
      $('#rightside-config-hide').css("animation", "rightside_out_animate .3s");
      $('#rightside-config-hide').removeClass("rightside-in")
      $("#rightside-config-hide").animate({}, function () {
        setTimeout(function () {
          $('#rightside-config-hide').css({
            "animation": "",
            "display": ""
          })
        }, 300)
      })
    } else {
      $('#rightside-config-hide').addClass("rightside-in")
      $("#rightside-config-hide").animate({}, function () {
        $('#rightside-config-hide').css("display", "block")
      })

    }
  })


  /**
   * 複製時加上版權信息
   */
  var copyright = GLOBAL_CONFIG.copyright
  if (copyright !== undefined) {
    document.body.oncopy = event => {
      event.preventDefault();
      let textFont, copyFont = window.getSelection(0).toString();
      if (copyFont.length > 45) {
        textFont = copyFont + '\n' + '\n' + '\n' +
          copyright.languages.author + '\n' +
          copyright.languages.link + '\n' +
          copyright.languages.source + '\n' +
          copyright.languages.info;
      } else {
        textFont = copyFont;
      }
      if (event.clipboardData) {
        return event.clipboardData.setData('text', textFont);
      } else {
        // 兼容IE
        return window.clipboardData.setData("text", textFont);
      }
    }
  }

  /**
   * justified-gallery 圖庫排版
   */

  if ($('.justified-gallery').length) {
    $('.justified-gallery > p > .fancybox').unwrap();
    $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/justifiedGallery@3.7.0/dist/css/justifiedGallery.min.css">');
    loadScript("https://cdn.jsdelivr.net/npm/justifiedGallery@3.7.0/dist/js/jquery.justifiedGallery.min.js", function () {
      if (typeof ($.fn.justifiedGallery) === 'function') {
        $('.justified-gallery').justifiedGallery({
          rowHeight: 220,
          margins: 4,
        });
      }
    })
  }

  /**
   * Darkmode
   */

  if (typeof autoChangeMode !== "undefined") {


    // if (autoChangeMode == '1') {
    //   window.matchMedia("(prefers-color-scheme: dark)").addListener(function (e) {
    //     if (e.matches) {
    //       activateDarkMode()
    //       change_light_icon()
    //       Cookies.remove('theme')
    //     } else {
    //       activateLightMode()
    //       change_dark_icon()
    //       Cookies.remove('theme')
    //     }

    //   })
    // }

    if (autoChangeMode == '1' || autoChangeMode == '2') {
      if (Cookies.get("theme") == "dark") {
        change_light_icon()
      } else {
        change_dark_icon()
      }
    }
  }

  function change_light_icon() {
    $("#darkmode").removeClass("fa-moon-o").addClass("fa-sun-o");
  }

  function change_dark_icon() {
    $("#darkmode").removeClass("fa-sun-o").addClass("fa-moon-o");

  }

  function switchReadMode() {

    var nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'

    if (nowMode == 'light') {
      change_light_icon()
      activateDarkMode()
      Cookies.set('theme', 'dark', {
        expires: 2
      })
      if (is_Snackbar) snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
    } else {
      change_dark_icon()
      activateLightMode()
      Cookies.set('theme', 'light', {
        expires: 2
      })
      if (is_Snackbar) snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
    }
  }

  $("#darkmode").click(function () {
    switchReadMode();
  });

  /**
   * 網頁運行時間
   */
  if (GLOBAL_CONFIG.runtime) {
    // get user config
    var start_date = $("#webinfo_runtime_count").attr("start_date")

    function show_date_time() {
      var BirthDay = new Date(start_date)
      var today = new Date()
      var timeold = (today.getTime() - BirthDay.getTime())
      var msPerDay = 24 * 60 * 60 * 1000
      var e_daysold = timeold / msPerDay
      var daysold = Math.floor(e_daysold)
      $('.webinfo_runtime_count').text(daysold + " " + GLOBAL_CONFIG.runtime_unit)
    }

    var interval;
    show_date_time()
    clearInterval(interval)
    interval = setInterval(show_date_time, 10000)
  }

  /**
   * 搜索
   */

  if (GLOBAL_CONFIG.localSearch === undefined && GLOBAL_CONFIG.algolia !== undefined) {
    $('a.social-icon.search').on('click', function () {
      openSearch()
      $('.ais-search-box--input').focus()
    })
    $('.search-mask, .search-close-button').on('click', closeSearch)

    var algolia = GLOBAL_CONFIG.algolia
    var isAlgoliaValid = algolia.appId && algolia.apiKey && algolia.indexName
    if (!isAlgoliaValid) {
      return console.error('Algolia setting is invalid!')
    }
    var search = instantsearch({
      appId: algolia.appId,
      apiKey: algolia.apiKey,
      indexName: algolia.indexName,
      searchParameters: {
        hitsPerPage: algolia.hits.per_page || 10
      },
      searchFunction: function (helper) {
        var searchInput = $('#algolia-search-input').find('input')

        if (searchInput.val()) {
          helper.search()
        }
      }
    })

    search.addWidget(
      instantsearch.widgets.searchBox({
        container: '#algolia-search-input',
        reset: false,
        magnifier: false,
        placeholder: GLOBAL_CONFIG.algolia.languages.input_placeholder
      })
    )
    search.addWidget(
      instantsearch.widgets.hits({
        container: '#algolia-hits',
        templates: {
          item: function (data) {
            var link = data.permalink ? data.permalink : (GLOBAL_CONFIG.root + data.path)
            return (
              '<a href="' + link + '" class="algolia-hit-item-link">' +
              data._highlightResult.title.value +
              '</a>'
            )
          },
          empty: function (data) {
            return (
              '<div id="algolia-hits-empty">' +
              GLOBAL_CONFIG.algolia.languages.hits_empty.replace(/\$\{query}/, data.query) +
              '</div>'
            )
          }
        },
        cssClasses: {
          item: 'algolia-hit-item'
        }
      })
    )

    search.addWidget(
      instantsearch.widgets.stats({
        container: '#algolia-stats',
        templates: {
          body: function (data) {
            var stats = GLOBAL_CONFIG.algolia.languages.hits_stats
              .replace(/\$\{hits}/, data.nbHits)
              .replace(/\$\{time}/, data.processingTimeMS)
            return (
              '<hr>' +
              stats +
              '<span class="algolia-logo pull_right">' +
              '  <img src="' + GLOBAL_CONFIG.root + 'img/algolia.svg" alt="Algolia" />' +
              '</span>'
            )
          }
        }
      })
    )

    search.addWidget(
      instantsearch.widgets.pagination({
        container: '#algolia-pagination',
        scrollTo: false,
        showFirstLast: false,
        labels: {
          first: '<i class="fa fa-angle-double-left"></i>',
          last: '<i class="fa fa-angle-double-right"></i>',
          previous: '<i class="fa fa-angle-left"></i>',
          next: '<i class="fa fa-angle-right"></i>'
        },
        cssClasses: {
          root: 'pagination',
          item: 'pagination-item',
          link: 'page-number',
          active: 'current',
          disabled: 'disabled-item'
        }
      })
    )
    search.start()
  }
  if (GLOBAL_CONFIG.localSearch !== undefined && GLOBAL_CONFIG.algolia === undefined) {
    $('a.social-icon.search').on('click', function () {
      var loadFlag = false
      openSearch()
      $('#local-search-input input').focus()
      if (!loadFlag) {
        search(GLOBAL_CONFIG.localSearch.path)
        loadFlag = true
      }
    })

    $('.search-mask, .search-close-button').on('click', closeSearch)

    function search(path) {
      $.ajax({
        url: GLOBAL_CONFIG.root + path,
        dataType: 'xml',
        success: function (xmlResponse) {
          // get the contents from search data
          var datas = $('entry', xmlResponse).map(function () {
            return {
              title: $('title', this).text(),
              content: $('content', this).text(),
              url: $('url', this).text()
            }
          }).get()
          var $input = $('#local-search-input input')[0]
          var $resultContent = $('#local-hits')[0]
          $input.addEventListener('input', function () {
            var str = '<div class="search-result-list">'
            var keywords = this.value.trim().toLowerCase().split(/[\s]+/)
            $resultContent.innerHTML = ''
            if (this.value.trim().length <= 0) {
              $('.local-search-stats__hr').hide()
              return
            }
            var count = 0
            // perform local searching
            datas.forEach(function (data) {
              var isMatch = true
              var dataTitle = data.title.trim().toLowerCase()
              var dataContent = data.content.trim().replace(/<[^>]+>/g, '').toLowerCase()
              var dataUrl = data.url
              var indexTitle = -1
              var indexContent = -1
              // only match artiles with not empty titles and contents
              if (dataTitle !== '' && dataContent !== '') {
                keywords.forEach(function (keyword, i) {
                  indexTitle = dataTitle.indexOf(keyword)
                  indexContent = dataContent.indexOf(keyword)
                  if (indexTitle < 0 && indexContent < 0) {
                    isMatch = false
                  } else {
                    if (indexContent < 0) {
                      indexContent = 0
                    }
                  }
                })
              }
              // show search results
              if (isMatch) {
                str += '<div class="local-search__hit-item"><a href="' + dataUrl + '" class="search-result-title">' + dataTitle + '</a>' + '</div>'
                count += 1
                $('.local-search-stats__hr').show()
              }
            })
            if (count === 0) {
              str += '<div id="local-search__hits-empty">' + GLOBAL_CONFIG.localSearch.languages.hits_empty.replace(/\$\{query}/, this.value.trim()) +
                '</div>'
            }
            $resultContent.innerHTML = str
          })
        }
      })
    }

  }

  function openSearch() {
    $('body').css('width', '100%')
    $('body').css('overflow', 'hidden')
    $('.search-dialog').animate({}, function () {
      $('.search-dialog').css({
        'display': 'block'
      }), 300
    })
    $('.search-mask').fadeIn();

    // shortcut: ESC
    document.addEventListener('keydown', function f(event) {
      if (event.code == "Escape") {
        closeSearch();
        document.removeEventListener('keydown', f);
      }
    })
  }

  function closeSearch() {
    $('body').css('width', '')
    $('body').css('overflow', '')
    $('.search-dialog').css({
      'animation': 'search_close .5s'
    })
    $('.search-dialog').animate({}, function () {
      setTimeout(function () {
        $('.search-dialog').css({
          'animation': '',
          'display': 'none'
        })
      }, 500)
    })

    $('.search-mask').fadeOut();
  }

  if (GLOBAL_CONFIG.baiduPush) {
    (function () {
      var bp = document.createElement('script');
      var curProtocol = window.location.protocol.split(':')[0];
      if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
      } else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
      }
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(bp, s);
    })();
  }

});

/**
 * function
 */

function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
};

function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };

  return throttled;
}


function isMobile() {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
};

function scrollTo(name) {
  var scroll_offset = $(name).offset();
  $("body,html").animate({
    scrollTop: scroll_offset.top
  })
};

function loadScript(url, callback) {
  var script = document.createElement("script")
  script.type = "text/javascript";
  if (script.readyState) { //IE
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" ||
        script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else { //Others
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  document.body.appendChild(script);
};

function snackbarShow(text, showAction, duration) {
  var showAction = (typeof showAction !== 'undefined') ? showAction : false;
  var duration = (typeof duration !== 'undefined') ? duration : 2000;
  var position = GLOBAL_CONFIG.Snackbar.position
  var bg = document.documentElement.getAttribute('data-theme') === 'light' ? GLOBAL_CONFIG.Snackbar.bgLight : GLOBAL_CONFIG.Snackbar.bgDark
  Snackbar.show({
    text: text,
    backgroundColor: bg,
    showAction: showAction,
    duration: duration,
    pos: position
  });
}


window.debounce = debounce

window.throttle = throttle

window.isMobile = isMobile