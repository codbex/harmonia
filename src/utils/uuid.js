const uuidv4 = self?.crypto?.randomUUID
  ? function () {
      return self.crypto.randomUUID();
    }
  : function () {
      console.warn('UUIDv4: Running in a non-secure context!');
      function _p8(s) {
        const p = (Math.random().toString(16) + '000000000').substring(2, 10);
        return s ? `-${p.substring(0, 4)}-${p.substring(4, 8)}` : p;
      }
      return _p8() + _p8(true) + _p8(true) + _p8();
    };

export default uuidv4;
