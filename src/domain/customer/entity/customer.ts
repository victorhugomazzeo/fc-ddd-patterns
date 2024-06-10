import EventDispatcher from "../../@shared/event/event-dispatcher";
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import CustomerAddressChangedEvent from "../event/customer-address-changed-event";
import CustomerCreatedEvent from "../event/customer-created-event";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log-handler";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log1-handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log2-handler";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private _eventDispacher: EventDispatcherInterface;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this._eventDispacher = new EventDispatcher();
    this.validate();
    this.customerCreated();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  customerCreated() {

    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();

    this._eventDispacher.register("CustomerCreatedEvent", eventHandler1);
    this._eventDispacher.register("CustomerCreatedEvent", eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: this.id,
      name: this._name,
    });

    this._eventDispacher.notify(customerCreatedEvent);
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
    this.addressChanged();
  }

  addressChanged() {

    const eventHandler = new EnviaConsoleLogHandler();

    this._eventDispacher.register("CustomerAddressChangedEvent", eventHandler);

    const addressChangedEvent = new CustomerAddressChangedEvent({
      id: this.id,
      name: this._name,
      address: this._address
    });

    this._eventDispacher.notify(addressChangedEvent);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
