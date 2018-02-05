import { Mock } from './mock';

class Foo {
  bar = ':-P';
  fighters = () => true;
  fightersWithParams = (par: string) => par;
  fightersVoid = (i: number): void => {
    // do something with i
  };
}

describe('Mock', () => {
  describe('constructor', () => {
    it('should construct the mock object with the supplied property', () => {
      const mock = new Mock<Foo>({ bar: ':-)' });
      expect(mock.Object.bar).toEqual(':-)');
    });

    it('should construct the mock object with the supplied function', () => {
      const mock = new Mock<Foo>({ fighters: () => false });
      expect(mock.Object.fighters()).toBeFalsy();
    });

    it('should construct the mock object with spies for the supplied function', () => {
      const mock = new Mock<Foo>({ fighters: () => false });

      mock.Object.fighters();
      expect(mock.Object.fighters).toHaveBeenCalled();
    });

    it('should not error if trying to spy on a function that already has a spy', () => {
      const mock = new Mock<Foo>({ fighters: () => false });

      expect(() => new Mock<Foo>(mock.Object)).not.toThrowError();
    });
  });

  describe('extend', () => {
    it('should extend the mock object with the supplied property', () => {
      const mock = new Mock<Foo>().extend({ bar: ':-)' });
      expect(mock.Object.bar).toEqual(':-)');
    });

    it('should extend the mock object with the supplied function', () => {
      const mock = new Mock<Foo>().extend({ fighters: () => false });
      expect(mock.Object.fighters()).toBeFalsy();
    });

    it('should extend the mock object with spies for the supplied function', () => {
      const mock = new Mock<Foo>().extend({ fighters: () => false });

      mock.Object.fighters();
      expect(mock.Object.fighters).toHaveBeenCalled();
    });

    it('should have no prob extending an already mocked method', () => {
      const mock = new Mock<Foo>({ fighters: () => true }).extend({ fighters: () => false });

      expect(mock.Object.fighters()).toBeFalsy();
      expect(mock.Object.fighters).toHaveBeenCalled();
    });

    it('should have no prob extending an already mocked method multiple times', () => {
      const mock = new Mock<Foo>().extend({ fighters: () => false });

      expect(mock.Object.fighters()).toBeFalsy();

      mock.extend({ fighters: () => true });

      expect(mock.Object.fighters()).toBeTruthy();

      mock.extend({ fighters: () => false });

      expect(mock.Object.fighters()).toBeFalsy();
      expect(mock.Object.fighters).toHaveBeenCalled();
    });

    it('should have no prob extending an already mocked property multiple times', () => {
      const mock = new Mock<Foo>().extend({ bar: 'first' });

      expect(mock.Object.bar).toEqual('first');

      mock.extend({ bar: 'second' });

      expect(mock.Object.bar).toEqual('second');

      mock.extend({ bar: 'third' });

      expect(mock.Object.bar).toEqual('third');
    });
  });

  it('should not break the pre-existing API', () => {
    const mock = new Mock<Foo>();

    mock.setup(f => f.fighters).is(() => false);
    mock.setup(f => f.bar).is('someValue');

    expect(mock.Object.fighters()).toBeFalsy();
    expect(mock.Object.bar).toEqual('someValue');
  });

  it('should be able to mix extend and setup methods', () => {
    const mock = new Mock<Foo>();

    mock.setup(f => f.fighters).is(() => false);
    mock.setup(f => f.bar).is('someValue');

    expect(mock.Object.fighters()).toBeFalsy();
    expect(mock.Object.bar).toEqual('someValue');

    mock.extend({ fighters: () => true, bar: 'someOtherValue' });

    expect(mock.Object.fighters()).toBeTruthy();
    expect(mock.Object.bar).toEqual('someOtherValue');
  });

  it('should be able to mix setup and extend methods', () => {
    const mock = new Mock<Foo>();

    mock.extend({ fighters: () => true, bar: 'someOtherValue' });

    expect(mock.Object.fighters()).toBeTruthy();
    expect(mock.Object.bar).toEqual('someOtherValue');

    mock.setup(f => f.fighters).is(() => false);
    mock.setup(f => f.bar).is('someValue');

    expect(mock.Object.fighters()).toBeFalsy();
    expect(mock.Object.bar).toEqual('someValue');    
  });

  it('should be able only spy a method with setup', () => {
    const mock = new Mock<Foo>();

    mock.setup(f => f.fighters);

    expect(mock.Object.fighters()).toBeUndefined();
  });

  it('should be able only spy a method with extend', () => {
    const mock = new Mock<Foo>();

    mock.extend({
      fighters: Mock.ANY_FUNC,
      fightersWithParams: Mock.ANY_FUNC,
      fightersVoid: Mock.ANY_FUNC
    });

    expect(mock.Object.fighters()).toBeUndefined();
    expect(mock.Object.fightersWithParams('test')).toBeUndefined();
    expect(mock.Object.fightersVoid(1)).toBeUndefined();
  });
});