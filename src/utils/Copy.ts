class Copy {
  public copyText(text: string) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.style.top = '-9999px';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.setAttribute('value', text);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
    }
    document.body.removeChild(input);
  }

  public copyTextByTextarea(text: string) {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
    }
    document.body.removeChild(textarea);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Copy();
