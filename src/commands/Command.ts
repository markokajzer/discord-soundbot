export default abstract class Command {
  abstract readonly triggers: string[];
  readonly numberOfParameters?: number;
  readonly usage?: string;
  readonly elevated: boolean = false;
  readonly handlesDeletion: boolean = false;

  abstract run(message: Message, params?: string[]): Promise<void>;
}
