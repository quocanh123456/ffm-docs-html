# Component catalog · DS FFM v2

> Sinh tự động từ `tokens/components.json` (`python3 scripts/build_catalog.py`). Import: `figma.importComponentSetByKeyAsync(key)` cho component có variant, `figma.importComponentByKeyAsync(key)` cho component đơn / icon. Prop: T = Text · B = Boolean · I = Instance swap.

## Button

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Button | Variant=Default / Secondary / Outline / Ghost / Destructive / Link; Size=sm / default; State=Default / Hover / Focus / Disabled | Label:T,Icon left:B,Icon left swap:I,Icon right:B,Icon right swap:I,Show count:B,Count:T | `e01d38c5ad11bd6e4d3f42eca5670b7f4f162339` |
| Button icon | Variant=Default / Secondary / Outline / Ghost; Size=sm / default; State=Default / Hover / Disabled | Icon:I | `e901faef0d81abd524f85e4a60fa6ad42ed4e6dd` |

## Button group · Toggle

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Toggle | Variant=Default / Outline; Size=sm / default; State=Off / Hover / On / Disabled | Icon:I,Show label:B,Label:T | `fde6e418b952f554e0f2030064d2feb48b665ae7` |
| Toggle group | Type=Default / Outline | — | `705f26f2c9ea8eb61657fb676ecb61c685ec14a6` |
| Button group | Type=Outline / Split / Vertical | — | `8ad69af759cfdc227523e5dcede6a54fd4e235d0` |

## Badge

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Badge | Intent=Brand / Success / Info / Warning / Error / Caution / Status 0 / Status 1 / Status 2 / Neutral; Style=Solid / Soft / Outline | Label:T | `ec972db4c348a6476073752430b5332802ed614c` |
| Count badge | Variant=Brand / Secondary / Destructive / Outline | Count:T | `71106c8d1c73e69efb29ab565b8ad807243b88c2` |

## Typography · Code

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Typography | Variant=H1 / H2 / H3 / H4 / Large / P / Lead / Small / Muted / Caption | Text:T | `fa135b80924b6dfd39ce6985e8c35f008354616a` |
| Inline code | — | Code:T | `8cc4e6e34d5b0a05cfaf5c556288c018e65301ce` |
| Blockquote | — | Quote:T | `600ebe334252859ed97ce8120fb346080d599a87` |
| Bullet list | — | — | `bc0a90e85444b009abd32a0c58e83f224a9ecf14` |
| Code block | Theme=Light / Dark | File name:T | `4ee5dbfdd44e9aae86280ce23036ed66cb0a4ad1` |

## Divider

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Divider | Orientation=Horizontal / Vertical | — | `545c5aaa2c281670faf898c1bb7159a0dd856f97` |

## Scroll area

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Scrollbar | Orientation=Vertical / Horizontal; State=Default / Hover | — | `04c2dd007ae99964d1e5b2528e67f922399dec17` |

## Input & Form

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Input | Size=sm / default; State=Default / Hover / Focus / Invalid / Disabled | Value:T,Icon left:B,Icon left swap:I | `28a19f234f83a7dec34cf1a1b298ec7122c4eba8` |
| Select | Size=sm / default; State=Default / Hover / Focus / Invalid / Disabled | Value:T | `400166d2992e97e7f9a1e66d33e390cbee04d002` |
| Textarea | State=Default / Focus / Invalid / Disabled | Value:T | `d6d9a7af7e67f6d7a35e990b25bfc1c24c38fc80` |
| Field | State=Default / Invalid | Label:T,Required:B,Description:B | `1abb010f4d15032fcea2f5974dd06584c985bded` |
| Dropdown menu item | State=Default / Hover / Selected / Destructive / Disabled | Label:T,Icon:B,Icon swap:I | `3d420c7722b0a0b714faf561855c9a850b032084` |
| Dropdown menu | — | — | `5e858061f924460b9d3846c1e8f10174bd8572d1` |

## Input nâng cao

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Label | State=Default / Disabled | Label:T,Required:B | `bfefdd4036e6a15b2dd02dbbbc51c7231272ba9e` |
| Input group | Type=Prefix / Suffix / Icon; State=Default / Focus / Disabled | Prefix:T,Suffix:T | `a87a3b825d5de4dc4d6a2951a87648750c0d1476` |
| Input OTP slot | State=Empty / Active / Filled | Digit:T | `ac7ec890dcd29bda4a29b2696e0f3e0b8b705e83` |
| Input OTP | — | — | `a4d2c05fd57079bc1a518bfa5527423da19f63b5` |
| Phone input | State=Default / Focus / Invalid | Code:T,Value:T | `de115b61e85906e24c5c4368ced5323b6d72aa36` |
| Slider | Type=Single / Range; State=Default / Disabled | — | `c71e0c57b23a6969b6388fcf0b162cb95a50e45f` |

## Command · Combobox

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Command item | State=Default / Selected / Disabled | Label:T,Icon:I,Show shortcut:B,Shortcut:T | `394774d7f4a053cbf44b99249ecda7d9f2d92647` |
| Command group label | — | Label:T | `4b44ebdd9e0b68321db48507584c38704f726ce6` |
| Command | — | — | `2b48fbc9326555326cd79248bef5964e6b690fb9` |
| Combobox | State=Closed / Open | Value:T | `e9eb8376f0ae2b5da533268104124412172cc09a` |
| Autocomplete | State=Suggest / Empty | — | `8eb9b05aa6f723fa678162e46a0a517c4fe8527c` |

## Calendar · Date picker

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Calendar day | State=Default / Hover / Today / Selected / Range start / In range / Range end / Outside / Disabled | Day:T | `efa2f6e13a8337dacf0c47018dc486b694fce9d5` |
| Calendar | — | — | `1ab2404056ddbcaeadf3e6b222c8cdcb7f9f8c94` |
| Date picker | State=Closed / Open | Value:T | `e7beb91d714196eb84407054239f2e422adaac77` |
| Time picker | State=Closed / Open | Value:T | `f0bae72e7d99b281c0bf9e2b558443788b04d877` |

## Checkbox · Radio · Switch

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Checkbox | Checked=False / True / Indeterminate; State=Default / Focus / Disabled | Label:T,Show label:B,Show description:B | `43cdd81879133136ab9242b2b61d77ded3cc0dc6` |
| Radio | Checked=False / True; State=Default / Focus / Disabled | Label:T,Show description:B | `a70703a1dfec1ea577694429c728dc620ab23517` |
| Switch | Checked=False / True; State=Default / Focus / Disabled | Label:T,Show label:B | `6950d2dcce51cd1922f93e56a222b61f6621c077` |

## Tabs

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Tab trigger | Style=Underline / Pill / View; State=Default / Hover / Active | Label:T,Show count:B,Count:T,Show icon:B,Icon:I | `5c62dec8d0937f789d972e74a7e7da6231eabfab` |
| Tab overflow | State=Default / Hover / Open | Label:T,Count:T | `9ed4d31903da4837b0abc1b6c2a149d77e8ce0d9` |
| Tabs list Pill | — | — | `6b8b028c0d6934665185cbbcd71c641d994c9fcc` |
| Tabs list / Underline | — | — | `b6215c8ecc5f646ce70b459672e7ba9c6bccc4a3` |

## List · Kanban · Sortable

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| List item | Leading=Icon / Avatar; State=Default / Hover / Selected | Meta:T,Show meta:B | `452642cce0b131d3860e7954283fdd5bbdb20860` |
| List | — | — | `f9c49864b9f93ac58f8590285359e1284f4059b3` |
| Kanban card | State=Default / Hover / Dragging | Order ID:T,COD:T,Show badge:B | `fdbbabddcece5b1ace5a4a311677d55cf91b3d0f` |
| Kanban column | — | Title:T,Count:T | `0b3f2a5436088b7040144f4fa0aead36ddecdcd3` |
| Sortable item | State=Default / Dragging / Drop target | — | `6f3553c77fb4f7b8bb664a785d47eed5f6d3efcf` |

## Carousel · Aspect ratio · Resizable

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Aspect ratio | Ratio=1:1 / 4:3 / 16:9 | — | `fcf6cfc850b390fbd1ead991ec81b4e53c7c4407` |
| Carousel dot | State=Default / Active | — | `8fa712d4b2feeaf1cd0a3bdced6c36996af9fe61` |
| Carousel | — | — | `21cfcfdac1f990de791bb84f0e9266ab150a727b` |
| Carousel / Thumbnails | — | — | `e9c7b224f82fd032e3a350696db47d4373bf05fc` |
| Resizable handle | Orientation=Vertical / Horizontal; Type=Line / Grip | — | `05924b1507df95b5b959b17e65492faafc88f43c` |
| Resizable panels | — | — | `156d1b758726817443cc1885d95f1666b29c2a65` |

## Table

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Table head | Align=Left / Right; State=Default / Hover / Sorted | Label:T,Sortable:B,Show icon:B,Icon:I,Column divider:B | `6aef6cff474ae790136e89f526346cb97040781c` |
| Table cell | Type=Text / Muted / Link / Badge / Action / Number / User / Dot / SLA; State=Default / Hover / Selected / Attention | Secondary:B,Column divider:B,Striped:B | `a4f954858b4a635d10cb00be9e0a3f46360f7084` |
| Table checkbox cell | State=Header / Default / Hover / Selected / Attention | Striped:B | `213bfb1441655843038858ee1eec7ae523f002a8` |
| SLA meter | Tone=Success / Warning / Error | — | `31b5aab1ef47f2b35e21ecbee419848d2cc7c4fd` |
| Table summary cell | Type=Value / Add / Empty | Value:T,Label:T,Column divider:B | `5d2100983c06082e5f22af5d724a178e302ca7ff` |

## Navigation

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Breadcrumb item | State=Link / Hover / Current / Ellipsis | Label:T | `d0dedb3f103cc5fe6e9e541b9219de25bb6df5c7` |
| Breadcrumb | Type=Default / Collapsed | — | `163152d460c5f3ed796a6aa3a77eec14f847be22` |
| Navigation menu trigger | State=Default / Hover / Open | Label:T,Show chevron:B | `8760ad2ca5165b2df81cbc767273358a1f4c1971` |
| Navigation menu | — | — | `4e35c0bd3112607762b03042a5e0ce74f2bf5ec9` |
| Menubar trigger | State=Default / Open | Label:T | `e8f27a8e11c8341e630f5028b7da2061f9681fe6` |
| Menubar | — | — | `ff64b3535ef235fc6d18e228c59ad31f1f8cb5b3` |

## Pagination

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Pagination item | Type=Number / Previous / Next / Ellipsis; State=Default / Hover / Active / Disabled | Number:T | `9a6644dfc56ea1c8908e891578e3981506c2ce48` |
| Pagination | — | Label 1:T,Value 1:T,Show item 2:B,Label 2:T,Value 2:T,Show item 3:B,Label 3:T,Value 3:T | `f8c66b5d86818ba55b73ea4c710a05cee7f8691d` |

## Accordion · Stepper · Rating

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Accordion item | State=Closed / Open | Title:T | `b225b6574f0b78ec88e46f0fc749f1ffa533ab0a` |
| Accordion | Type=Default / Card | — | `80711e7cfc3d4beaefa5bf66baa08de9076a5240` |
| Collapsible | State=Closed / Open | Title:T | `4b317c5dc6d453b8ee7b977f39ffe40366a87665` |
| Step | State=Completed / Current / Upcoming | Label:T,Caption:T,Show caption:B,Number:T | `733d72dc5138f07a1079878e58c8ac7da01cdfb9` |
| Stepper | Orientation=Horizontal / Vertical | — | `798ab73f9cea7014332777ceb717fd428ef056c6` |
| Rating star | State=Filled / Half / Empty; Size=16 / 20 | — | `99b830e6b30b2f17876445ea62b74b3f6fe04ef6` |
| Rating | — | Score:T,Count:T | `6cd0e662c411a11208a5c3f5f85a352a1b3ade57` |

## Card · Avatar

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Card | — | Title:T,Description:T,Show description:B,Show footer:B | `593dabc89c667d85d8857d8f2375498c04ab7c50` |
| Stat card | Trend=Up / Down | Value:T,Label:T | `7de83a3979bd457cd9693d2eaf0bafca90458451` |
| Avatar | Size=24 / 32 / 40 / 56; Type=Initials / Icon / Image; Color=Neutral / Blue / Green / Orange / Red / Yellow / Cyan / Pink / Purple | Initials:T | `a0b0e62203bfef3ba904168bfccf27c3457eb3c4` |
| App icon | App=Orders / Customer service / Warehouse / PIM / Finance / Setting / CRM | — | `ef6678dad90b8028329dbd0700f0b161049b2139` |
| App card | State=Default / Hover | Title:T,Modules:T | `c7eada37c1b8e52881906a9cd03d1af92da92ca7` |

## Feedback

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Progress | Type=Bar / Labeled / Circle; Intent=Brand / Success / Warning / Error | — | `f3a1f92ab80c050acba54a53836af3ade16cdb31` |
| Skeleton | Shape=Line / Circle / Block | — | `df62f813a66ae64b9b4adc6337a8dd3d993ba247` |
| Skeleton / Table row | — | — | `c68838c817865713df660fc6d447c0c9a191d4f2` |
| Skeleton / Card | — | — | `be57a8a4d8021e1ec3f3539c6ab78163f4dffe52` |
| Spinner | Size=sm / md / lg; Tone=Default / Brand / Inverse | — | `4178f9719f3bdf94d25d6304525948b4f8a06039` |
| Kbd | Size=sm / md | Key:T | `8023bb77634d8054d4d2cd06145ca5d9caca3fcf` |
| Kbd group | — | — | `e50a6e7b18bfb440e722fe28f2204caa0090f4ed` |

## Alert · Toast · Tooltip

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Alert | Variant=Default / Info / Success / Warning / Destructive | Show description:B | `64d5c3b4a5b80ce299841d54735f195f292ce476` |
| Toast | Type=Default / Success / Info / Warning / Error | Show description:B,Show action:B | `a447ea191e69482569e484f03dff4861d1b459c9` |
| Tooltip | Side=Top / Bottom / Right | Label:T | `d8a78230b17cd08300aac7b3297f7fdf007e6058` |
| Chart tooltip | — | Label:T,Value:T,Show dot:B | `345aa3484c158c3192142f9f0ebaaded463e6088` |

## Popover · Context menu

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Popover | — | Title:T | `a8efdc5fb428211b9c13857835079127bf73073a` |
| Context menu | — | — | `85c512f5d72c5cef36f8f6121839ee875cc050fe` |
| Hover card | — | — | `3e19fd7f9eb8e614e3c4bf1b2df1aaf9a8b48466` |

## Dialog

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Dialog | Type=Form / Confirm | — | `f1445228134026afca7ea798ccf604c9733e6a8c` |
| Sheet / Order detail | — | — | `87f42cb0cca3d7cfc4302f0d125a4fa677204e3e` |

## Bill · Receipt

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Receipt row | Type=Default / Discount / Total / Muted | Label:T,Value:T | `0adb62e10ba700042c1e9c522a021c7e2f9c5978` |
| Receipt item | — | Name:T,Meta:T,Price:T,Show thumb:B | `dade190342a44722bc511de87aedc663b0176d0d` |
| Receipt divider | Style=Dashed / Solid | — | `0e18ba0f443918d1b43580d5e79529a5a2ca0c68` |
| Receipt | Status=Paid / Pending / Failed / Refunded | Amount:T,Time:T,Show items:B,Show footer:B | `65293a1aeb46361a98731250775b2b144d5f104c` |

## Bulk action

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Bulk action item | Type=Label / Icon; Tone=Default / Danger; State=Default / Hover | Label:T,Icon:I | `338705972fac7c122391c2e96020cd7fb52e9c6b` |
| Bulk selection pill | — | Count:T | `d4f7a875462103fde57b2bd27f18899d5eb8e84c` |
| Bulk action bar | — | — | `4a7396c545f73d59c874a83b764bcf9aa64e5253` |

## Drawer

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Drawer | Size=sm / md / lg | Show rail:B,Show hint:B,Title:T | `f663a5cbe39b4e38869bfbd42ac51d13f5899935` |
| Drawer property row | Value=Filled / Empty / Badge / User; State=Default / Hover | Label:T,Icon:I,Value:T | `3daaa9eef15d8259a422ff441fc9d60aa66f559f` |
| Drawer header | — | Breadcrumb:T | `119efb253f883bae362cc7c7245630d321b5edd1` |
| Drawer rail item | State=Default / Hover / Active | Icon:I | `2934142d56308bc9250995aaa04a8ee6525c20b6` |

## Sidebar & Header

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Sidebar menu item | Mode=Expanded / Collapsed; State=Default / Hover / Active | Label:T,Icon:I,Show badge:B | `aa4e6d44efe6d09b68fb3a6d14cfa3817b2bf5ee` |
| Sidebar | Mode=Expanded / Collapsed | — | `4e9af130e1e5a786193435dea99ce5fd07385a93` |
| Site header | — | Page:T,Section:T | `437f91cfa8c5cee47f5ee309930612eff03ad9dd` |
| Header search | State=Default / Hover / Focus | Placeholder:T,Show shortcut:B | `7aff930bbbf84f36106eaf1b1460dbf734b42f08` |
| Page header | — | Title:T,Show search:B,Show notifications:B,Show more:B | `76f20132a3bb594c3107f2eb19368d9e3f040e32` |

## Settings

| Component | Variant | Prop khác | Key |
|---|---|---|---|
| Setting row | Control=Select / Switch / Button / None | Title:T,Description:T,Show description:B,Divider:B | `54cdf953963768dea85436e6c5853b5fe61dfd64` |

## Icon (102 · Phosphor Regular 16)

Phosphor Regular, 16px, 1 lớp Vector fill bind context/fg/base/icon. Dùng làm Instance swap cho Button / Input / Tab…

| Icon | Key |
|---|---|
| icon/plus | `f145e3cb15cfa2360bd31140d82f631db43b83ac` |
| icon/magnifying-glass | `2603ce2ba3edaf23a858d418ebd0985a98213047` |
| icon/funnel | `65a619b7ff4e3c48a92bb70aa4e3445797b2d5ba` |
| icon/caret-down | `04885ca2ca82bcac1c40b1e001d64b217361da6a` |
| icon/caret-up | `24074f4f87e5f0a891b0bce4f238dd996a9db9ba` |
| icon/caret-left | `6198ba5d8336a8b4b132dadc7b6556b4e0666413` |
| icon/caret-right | `b11b702d7ff1c5f4ec8f6c71869e932c81bdd71a` |
| icon/caret-up-down | `58ca7f07a1a70a514a246b8c79e7d9dbe6455efd` |
| icon/x | `2c867053fc9c96aeedf5f294f6ae44de3a96e150` |
| icon/check | `bedd78cd25bbe8fff3273d8c6b6509ddb001ca22` |
| icon/arrows-clockwise | `eb64e74ebc6739748e0e36da2e6d5253a27e1380` |
| icon/columns | `bfa6328cf59b9e8bcfe00d3ca6c9321fc83d9971` |
| icon/printer | `f17028974f568ed88ab93ae460f300cfdc03f80f` |
| icon/package | `49c50c0d646a0aba12e099ed069ac84177c0555b` |
| icon/truck | `e5623f0a7750dc881064d9216955eebd72d99e4a` |
| icon/warehouse | `b2aa8399943d52e886aa57ef28b040c53f613bb6` |
| icon/user | `a399e6b4a9f8cb54188e75f90ce4a23c48a4c22d` |
| icon/users | `df9748c93bdf7943376bfac95e1648830ced8368` |
| icon/gear | `a73b59d054782223352adeec2b42139b27e8808d` |
| icon/chart-bar | `2958df0acf20fcef7c049a4b0241464df1a17065` |
| icon/phone | `6d3d315d38e29f178b5920b3d6e76a472ac62d49` |
| icon/receipt | `5e3cd00eb1e1c5ad4346dd6cbd2a30869ff64f88` |
| icon/dots-three | `a2b794aa36bb1160f510ec79ef341ce6801ccf53` |
| icon/dots-three-vertical | `5ffecc0646633fc271acd4cb9c4fe163f35b4e11` |
| icon/info | `2fd48fd48524f60481fca77e1c2dcf925896295d` |
| icon/warning | `5857e003e24565e7eedc1abd41b105bb1bda4b02` |
| icon/warning-circle | `fe3c5ef9974e4b4e073b398477feb8c2edd3abe7` |
| icon/check-circle | `696b15123fe788988445d7360a3e3f26b5fe37d0` |
| icon/x-circle | `6b0e26b2bba4d9bc093bf104c14eb44481fd046e` |
| icon/calendar-blank | `ddeef1b9f4f4fd6f6e159d022793765c3788d1bf` |
| icon/download-simple | `5fb7641978ede5de3f9b675436c7131cd4cce157` |
| icon/upload-simple | `c39d093959231d3a60f7ba366cdd69e6610bdf55` |
| icon/trash | `aa5c09760d76dde7e01b82d3308c5aed5e9756ca` |
| icon/pencil-simple | `c5d43e2457432222816c0e0ea53209ae362a9226` |
| icon/copy | `ee0ee6b7d5027e0d6f889bce50560f1b9eb116d9` |
| icon/eye | `ef4c9f35862b31cc313ec7e1b9193b56bdbbe7c6` |
| icon/barcode | `21cec9ccd0a01b58c3e088ffad3518ea478bce7c` |
| icon/storefront | `f51651fec51a545428b400a4d8adb45d70585d39` |
| icon/wallet | `2ce8eba03e9cc16a467daa724979fe1377e39075` |
| icon/headset | `0f887309e7de58ab2dff8ca0a8203a951aa519c6` |
| icon/squares-four | `fec38f89cb530d87a1d70978c1d94d07357ec1b7` |
| icon/sign-out | `634d73bd0fc9c48289ca0bd202b21f88776b7d10` |
| icon/bell | `d61baaf7bf698a79c9346129058e78d4a0a1f305` |
| icon/globe | `a6535a57304eefcf4316b1eb1758b086b5934843` |
| icon/question | `ee57d0932c51d9affe5c7a16f482c21d27e4c418` |
| icon/list-checks | `0122e0505237cd828af74596b6ffa2310b0b7a92` |
| icon/tag | `cb083502655ef2e4b7cef1a8e6b8e6f9b13ee387` |
| icon/arrow-left | `a957350247ef2df63f875cb9036a20b0e484e693` |
| icon/arrows-down-up | `cbcb38f3d6cb80d687574f6cc65b2a7add79ca73` |
| icon/sidebar-simple | `3cf1fa6e7036e149b1ec71c10c8bcb990f80c43a` |
| icon/house | `9d77fd4803f9b45a5b1c82f4c3ecc93b89ea66d0` |
| icon/tray | `daa09aea52bb1c5e34a435f3391a4362d80b9282` |
| icon/file-text | `d9e525d474c0209ff87903c6be17ae364e9a8d6d` |
| icon/minus | `2806c6bcdcaa14ef6939729ddc5deab508821536` |
| icon/target | `e01e85622b820456134ff53fbf7c50a61a89e77a` |
| icon/user-plus | `a30976614f2d5547dfa0fc0cab2ac8170a97338b` |
| icon/archive | `f5a5aa72240717fc5ffd3688730d403ff73ddc11` |
| icon/chat-centered-text | `656f49b7386a72e346d78db9596cad123ab4e492` |
| icon/pulse | `fa14078036fdd3a43b01a55f5a1f1c5667537c7d` |
| icon/arrows-out-simple | `f0d058c9fd793af82110d96a9bbc6b531cb94eb0` |
| icon/paperclip | `c27be6f2fb2b2f802e06734ff68ff71eeeea7cbc` |
| icon/link-simple | `c747f6ef8b86e1d598b5c31a15413aeacad416ad` |
| icon/flag | `65c1717f62c5c6df6688b873def9ee2766f68fc2` |
| icon/floppy-disk | `44b00acaf90d81b59b68e892360a494537e7fea7` |
| icon/star | `b883c3bdf489130a698e256acc15ea02fa8b2cf3` |
| icon/dots-six-vertical | `f412e0e75eee9340280643ce09757606e0fcf10d` |
| icon/dots-six | `efb5d3285d40e3a9b84047837c424fe8cff9fd78` |
| icon/circle-notch | `d283260f1973130341671763d292c8b1f8f81390` |
| icon/text-b | `739d3f30a053a42e956d8403a3815cbee1045fbe` |
| icon/text-italic | `2fb6eb938347ad442434546435bb2bee9dcbc346` |
| icon/text-underline | `cc686aa1210aff68c13fcc153ec95ca47d7400ef` |
| icon/text-align-left | `371534ab09a43930baaffe704703df034990f517` |
| icon/text-align-center | `b4ae3bde6fd0a8dfe6866afca5a9a162750af45d` |
| icon/text-align-right | `94370099d828c3bcdcc5481ab827472294377583` |
| icon/clock | `9cbda50c5336776cf304a9512c27e6b96be8d809` |
| icon/image | `6aeaff7855ed3729401aed4bb5cf9f930fbf5f84` |
| icon/arrow-right | `ba975d9e872c407c4198c59633da2dee462de455` |
| icon/caret-double-left | `fa7a614b2c619e665d386b115342c8333337ea4b` |
| icon/caret-double-right | `dc7fc0ed830bbb9a9e0db60d2de4c4918a12df0a` |
| icon/code | `e98480e7522afe7b1fe032c244af0996a55098a3` |
| icon/quotes | `5533bd09aa15bd6e3cbc04d1ce9f9e3dc824eb30` |
| icon/folder | `c8159a5317bda80d15fa351dd87cc4d78fa7db4e` |
| icon/command | `2ff820d77b58b8040fa1c1f206b331f5924b8335` |
| icon/credit-card | `b9ce54746b7584bf725192653b435b6cf8776382` |
| icon/bank | `b5dc6667e72851c00a61748ca1970b693875ce9e` |
| icon/money | `55776d2aa561fcb135546187384d8a3cc55466b6` |
| icon/qr-code | `f66311b76150a55e0981a27cfcf562d5ea91fa79` |
| icon/map-pin | `194b6a20b137a7588df7a8593d69d65a61eddc9d` |
| icon/share-network | `43db2efe40c66fcea77c9db659f00890e1ac1708` |
| icon/hourglass | `5741d04e7360ba0a2b9a4fac32f4d460ef859601` |
| icon/seal-check | `c399f740e5180f45847cfd2ec71546266f167fee` |
| icon/clock-countdown | `336a93740786b491996568c44d851ad888bb2cad` |
| icon/cash-register | `4292ea99c9f93891155bb5c6b0ff6f443275097f` |
| icon/arrow-square-out | `e1eaba3f047622d0edd2c3f9e23324715008f24c` |
| icon/currency-circle-dollar | `9ee915efe5e13dd616a9d57563e5e8dbe8b634dd` |
| icon/envelope-simple | `00dc127dd6d48068634b7b2b233e31ce9d05367f` |
| icon/chat-circle-dots | `134ad7f8c718539ac9206a6ff9bab51d6f38f627` |
| icon/calendar-check | `9dc0d0adfb1ad94bb1e6b3c99fc8584e2969dbf2` |
| icon/sparkle | `e0eda362857c6cf1492cec91fab32194f1980235` |
| icon/lightning | `c699c954b3739940ce992a2386dc3a2b13d0a907` |
| icon/shield-check | `49bd2cbdf380044a165e6d78bae0d5e454c70150` |
| icon/dots-three-circle | `71ff80d0d0c3b22ecd7d8cb4aa9818e0de4b1b7a` |

## Paint style

Avatar/Photo 01–20 (IMAGE). Import: figma.importStyleByKeyAsync(key)

- Avatar/Photo 01: `19770bb25d60d737580d81de7c3689883f4b6524`
- Avatar/Photo 02: `7477b1ed5126874dcef9d90d4aaf992c0a0e1cfd`
- Avatar/Photo 03: `d7195413ea7f417d2f81cce9b24674c2b9fba248`
- Avatar/Photo 04: `b3ddf4aa1fedf94b56be8712ef43cf1efd84e1b5`
- Avatar/Photo 05: `37a9311b4c95524473b092a2f24bd3064d6c28c8`
- Avatar/Photo 06: `313b250373e75a7ad947f6df591eb7e760b36e20`
- Avatar/Photo 07: `925f6aed647b7890d262f576dfb5cb290631b304`
- Avatar/Photo 08: `978a110a2c2a4a46b2ebdf340f20882613195e8f`
- Avatar/Photo 09: `773338da467b4bee2faf4b21ab01ec5ce835e240`
- Avatar/Photo 10: `be836c6bf89ba0c8805ca5af63b1a482b032587c`
- Avatar/Photo 11: `77a0337135f90c2cc9adb3b0e1b06144336d8edb`
- Avatar/Photo 12: `17aaf286cdeaf4c89be179f608c63201672c2b49`
- Avatar/Photo 13: `73b6ac21929b235d6080d0ecf67ff1da2fedf0cd`
- Avatar/Photo 14: `a40fc70583e5996fa16df222e4e9176b7efa4670`
- Avatar/Photo 15: `d4d0d39995fa3ccb22998fad61078a6af65c4624`
- Avatar/Photo 16: `070492933acc5e0ba832a96612ee7fa6351613ac`
- Avatar/Photo 17: `f0426ad52f94b833ef1cc97e6b4de55a06735b45`
- Avatar/Photo 18: `c109b14176e1e55a22bc82264e74c9e8b3dea54f`
- Avatar/Photo 19: `8a7218ab3751563dd70f2e9561119cdc7e875f5d`
- Avatar/Photo 20: `3762dde87a29e4c8fb74e2b05210bab9d2f0ff00`

## Màn chính (Master_Data_FFM)

| Màn | Key | Node | Mô tả |
|---|---|---|---|
| OL2_1 Danh sách đơn – Mặc định | `dda72796155defacfa1ec444b2a32325f026ed50` | 201:8946 | Orders › Danh sách đơn hàng (/admin/order) · 1440×960 · ENG |
| PR_1 Phân quyền – Quyền của phòng ban | `c828e06f2874056f01281d65e95637cdca496aab` | 201:10447 | Settings › Team › Permissions — tab Permissions (/admin/order/permission) · 1440×2429 · ENG |
| PR_2 Phân quyền – Thành viên | `62651f6fa73f9469a61c7b49a01bb5c6b8582138` | 201:10448 | Settings › Team › Permissions — tab Members · 1440×960 · ENG |
