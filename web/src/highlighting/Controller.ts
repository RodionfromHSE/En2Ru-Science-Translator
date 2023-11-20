export class Controller {
  /**
   * Controller class to handle highlight and text updates.
   */
  constructor(
    public setInputs: [(text: string) => void, (text: string) => void],
    public setHighlights: [(highlight: any) => void, (highlight: any) => void],
  ) {}
}
