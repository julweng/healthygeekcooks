const searchFormTemplate = `
<form action="#" role="form" accept-charset="UTF-8" method="get" class="col-12" id="search-form">
  <div class="row">
    <label class="text-red search-label col-12 center" for="search"><span id="search-span">Search:</span>
    <input type="text" id="search-input" placeholder="milk of the poppy, butterbeer..." required />
    <input class="pointer red-background text-white" type="submit" id="searchsubmit" value="&#xf002;">
    </label>
  </div>
  <div class="row">
      <div class="col-12 center">
      <label class="pointer padding-right"><span class="left padding-right text-red">By:</span>
      <input type="radio" checked="checked" name="radio" role="checkbox">
    Name</label>
      <label class="pointer padding-right">
      <input type="radio" checked="checked" name="radio" role="checkbox">
    Series</label>
      <label class="pointer padding-right">
      <input type="radio" checked="checked" name="radio" role="checkbox">
    Type</label>
    </div>
  </div>
</form>`;

module.exports = {searchFormTemplate};
