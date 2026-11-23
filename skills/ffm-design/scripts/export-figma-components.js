// Chạy trong file DS FFM (bRzGSf4BNsKuwF5w8ISJvT) qua `use_figma`.
// Liệt kê component set / component đơn + key + thuộc tính trên các trang COMPONENTS.
// Không đổi trang hiện tại (dùng page.loadAsync) nên chạy được trong 1 lần gọi.
// Kết quả dán vào tokens/components.json (giữ đúng format [name, key, variants, props]).

const SKIP = /^(📘|📖|🧭|———|🧠|\s*↪|🎨|✍️|📏|✨)/; // bỏ trang Cover, Rules, Foundations
const out = {};
for (const p of figma.root.children) {
  if (SKIP.test(p.name)) continue;
  await p.loadAsync();
  const comps = p.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] })
    .filter((n) => !(n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET'));
  if (!comps.length) continue;
  out[p.name] = comps.map((n) => {
    let v = []; const o = [];
    try {
      const d = n.componentPropertyDefinitions;
      for (const k in d) {
        const t = d[k]; const nm = k.split('#')[0];
        if (t.type === 'VARIANT') v.push(nm + '=' + t.variantOptions.join('|'));
        else o.push(nm + ':' + t.type[0]);
      }
    } catch (e) {}
    return [n.name, n.key, v.join('; '), o.join(',')];
  });
}
return out;
