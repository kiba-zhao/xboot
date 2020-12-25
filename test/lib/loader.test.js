/**
 * @fileOverview 加载类功能测试
 * @name loader.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const Loader = require('@/lib/loader');

describe('lib/loader', () => {

  let loader;

  beforeEach(() => {
    loader = new Loader();
  });

  describe('forEach', () => {

    it('success', () => {

      const arr = [ 1, 2, 3, 4, 5, 6 ];
      const fn = jest.fn();

      loader.forEach.call(arr, fn);

      expect(fn).toHaveBeenCalledTimes(arr.length);
      expect(fn.mock.calls).toEqual(arr.map((...args) => args));
    });

    it('success with empty', () => {

      const arr = [];
      const fn = jest.fn();

      loader.forEach.call(arr, fn);

      expect(fn).not.toHaveBeenCalled();

    });

    it('fn is null', () => {

      expect(() => {
        const arr = [ 1, 2, 3, 4, 5, 6 ];
        loader.forEach.call(arr, null);
      }).toThrow();

    });

    it('fn is undefined', () => {

      expect(() => {
        const arr = [ 1, 2, 3, 4, 5, 6 ];
        loader.forEach.call(arr, undefined);
      }).toThrow();

    });

  });

  describe('filter', () => {

    it('success', () => {
      const arr = [ 1, 2, 3, 4, 5, 6 ];
      const result = [ 1, 3, 4, 6 ];
      const fn = jest.fn(_ => result.includes(_));

      const filterArr = loader.filter.call(arr, fn);

      expect(fn).not.toHaveBeenCalled();

      const res = [];
      for (const item of filterArr) {
        res.push(item);
      }

      expect(fn).toHaveBeenCalledTimes(arr.length);
      expect(res).toEqual(result);
    });

    it('success with empty', () => {
      const arr = [];
      const result = [ 1, 3, 4, 6 ];
      const fn = jest.fn(_ => result.includes(_));

      const filterArr = loader.filter.call(arr, fn);

      expect(fn).not.toHaveBeenCalled();

      const res = [];
      for (const item of filterArr) {
        res.push(item);
      }

      expect(fn).not.toHaveBeenCalled();
      expect(res).toEqual([]);
    });

  });

});
