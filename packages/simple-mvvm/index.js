class simpleVue {
  constructor(obj_instance) {
    this.$data = obj_instance.data;
    Observer(this.$data);
    Compile(obj_instance.el, this);
  }
}

// 数据劫持
function Observer(data_instance) {
  if (!data_instance || typeof data_instance !== 'object') return;
  const dependency = new Dependency();
  Object.keys(data_instance).forEach(key => {
    let value = data_instance[key];
    Observer(value); //递归子属性
    Object.defineProperty(data_instance, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log('访问了属性', key, value);
        // 订阅者加入依赖是实例的数组
        Dependency.temp && dependency.addSub(Dependency.temp);
        if (Dependency.temp) {
          console.log(Dependency.temp);
        }
        return value;
      },
      set(newValue) {
        console.log('新值');
        value = newValue;
        Observer(newValue);
        dependency.notify();
      },
    });
  });
}

// 解析函数
function Compile(element, vm) {
  vm.$el = document.querySelector(element);
  const fragment = document.createDocumentFragment();
  let child;
  while ((child = vm.$el.firstChild)) {
    fragment.append(child);
  }
  fragment_compile(fragment);
  function fragment_compile(node) {
    const pattern = /\{\{\s*(\S+)\s*\}\}/;
    if (node.nodeType === 3) {
      const xxx = node.nodeValue;
      const result_regex = pattern.exec(node.nodeValue);
      if (result_regex) {
        const arr = result_regex[1].split('.');
        const value = arr.reduce((total, current) => total[current], vm.$data);
        node.nodeValue = xxx.replace(pattern, value);
        // 创建订阅者
        new Watcher(vm, result_regex[1], newValue => {
          node.nodeValue = xxx.replace(pattern, newValue);
        });
      }
      return;
    }
    if (node.nodeType === 1 && node.nodeName === 'INPUT') {
      const attr = Array.from(node.attributes);
      attr.forEach(i => {
        if (i.nodeName === 'v-model') {
          const value = i.nodeValue
            .split('.')
            .reduce((total, current) => total[current], vm.$data);
          node.value = value;
          new Watcher(vm, i.nodeValue, newValue => {
            node.value = newValue;
          });
          node.addEventListener('input', e => {
            // const name = i.nodeValue;
            // vm.$data[name] = e.target.value; // 这里满足不了对象的设置
            const arr1 = i.nodeValue.split('.');
            const arr2 = arr1.splice(0, arr1.length - 1);
            const final = arr2.reduce(
              (total, current) => total[current],
              vm.$data
            );
            final[arr1[arr1.length - 1]] = e.target.value;
          });
        }
      });
    }
    node.childNodes.forEach(child => fragment_compile(child));
  }
  vm.$el.appendChild(fragment);
}

// 依赖 -〉 收集和通知订阅者
class Dependency {
  constructor() {
    this.subscribers = [];
  }

  addSub(sub) {
    this.subscribers.push(sub);
  }
  notify() {
    this.subscribers.forEach(sub => sub.update());
  }
}

// dinyuezhe
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;
    // 临时属性： 触发getter
    Dependency.temp = this;
    console.log(key);
    key.split('.').reduce((total, current) => total[current], vm.$data);
    Dependency.temp = null;
  }
  update() {
    const value = this.key
      .split('.')
      .reduce((total, current) => total[current], this.vm.$data);
    this.callback(value);
  }
}
