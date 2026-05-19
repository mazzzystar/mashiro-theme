function trans_punc(content) {
    if (typeof(content) !== 'string') {
        return null;
    }
    var protectedBlocks = [];
    var stash = function(match) {
        var key = '\u0000CODE_BLOCK_' + protectedBlocks.length + '\u0000';
        protectedBlocks.push(match);
        return key;
    };

    content = content
        .replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[ \t]*(?=\n|$)/g, stash)
        .replace(/`[^`\n]+`/g, stash);

    content = content.
        replace(/([，；！：、？：）》」』】（《「『【。〈〉“”]+)/g, '<span class="bd-box">$1</span>').
        replace(/(，|；|！|：|、|？|：|）|》|」|』|。|〉|】|”)/g, '<h-char class="bd bd-beg"><h-inner>$1</h-inner></h-char>').
        replace(/(（|《|「|『|【|〈|“)/g, '<h-char class="bd bd-end"><h-inner>$1</h-inner></h-char>')
        ;

    protectedBlocks.forEach(function(block, index) {
        content = content.replace('\u0000CODE_BLOCK_' + index + '\u0000', block);
    });

    return content;
}

hexo.extend.filter.register('before_post_render', function(data){
    data.content = trans_punc(data.content);
    return data;
});
