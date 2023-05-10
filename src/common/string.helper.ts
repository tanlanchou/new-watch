export function stripHtmlTags(html: string): string {
  // 匹配 HTML 标签的正则表达式
  const regex = /(<([^>]+)>)/gi;
  return html.replace(regex, '');
}
