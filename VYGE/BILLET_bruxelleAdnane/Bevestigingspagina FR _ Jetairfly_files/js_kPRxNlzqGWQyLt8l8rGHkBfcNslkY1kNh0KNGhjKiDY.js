(function ($) {

  $(document).ready(function () {

    // Expression to check for absolute internal links.
    var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

    // Attach onclick event to document only and catch clicks on all elements.
    $(document.body).click(function (event) {
      // Catch the closest surrounding link of a clicked element.
      $(event.target).closest("a,area").each(function () {

        var ga = Drupal.settings.tuigoogleanalytics;
        // Expression to check for special links like gotwo.module /go/* links.
        var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
        // Expression to check for download links.
        var isDownload = new RegExp("\\.(" + ga.trackDownloadExtensions + ")$", "i");

        // Is the clicked URL internal?
        if (isInternal.test(this.href)) {
          // Skip 'click' tracking, if custom tracking events are bound.
          if ($(this).is('.colorbox')) {
            // Do nothing here. The custom event will handle all tracking.
          }
          // Is download tracking activated and the file extension configured for download tracking?
          else if (ga.trackDownload && isDownload.test(this.href)) {
            // Download link clicked.
            var extension = isDownload.exec(this.href);
          }
          else if (isInternalSpecial.test(this.href)) {
            // Keep the internal URL for Google Analytics website overlay intact.
            //_gaq.push(["_trackPageview", this.href.replace(isInternal, '')]);
          }
        }
        else {
          if (ga.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          }
          else if (ga.trackOutbound && this.href.match(/^\w+:\/\//i)) {
            if (ga.trackDomainMode == 2 && isCrossDomain(this.hostname, ga.trackCrossDomains)) {
              // Top-level cross domain clicked. document.location is handled by _link internally.
              ga("send", "event", "Outbound links", "Click", this.href);
              event.preventDefault();
            }
          }
        }
      });
    });

  });

  /**
   * Check whether the hostname is part of the cross domains or not.
   *
   * @param string hostname
   *   The hostname of the clicked URL.
   * @param array crossDomains
   *   All cross domain hostnames as JS array.
   *
   * @return boolean
   */
  function isCrossDomain(hostname, crossDomains) {
    /**
     * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
     * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
     * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
     *
     * @todo: Remove/Refactor in D8
     */
    if (!crossDomains) {
      return false;
    }
    else {
      return $.inArray(hostname, crossDomains) > -1;
    }
  }

})(jQuery);
;
