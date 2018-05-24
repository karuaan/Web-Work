import { DefaultToZeroPipe } from './default-to-zero.pipe';

describe('DefaultToZeroPipe', () => {
  it('create an instance', () => {
    const pipe = new DefaultToZeroPipe();
    expect(pipe).toBeTruthy();
  });
});
