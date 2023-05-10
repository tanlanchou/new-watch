import { parseStringPromise } from 'xml2js';
export default class xmlParseService {
  public static async parseString(xml: string) {
    return await parseStringPromise(xml);
  }
}
