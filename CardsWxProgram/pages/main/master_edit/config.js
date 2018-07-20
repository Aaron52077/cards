module.exports = {
    // Form 中使用输入框
    form: {
        name: {
            error: true,
            title: '工地名称',
            placeholder: '填写工地名称',
            componentId: 'name'
        },
        style: {
            error: true,
            title: '工地风格',
            placeholder: '填写工地风格',
            componentId: 'style'
        },
        area: {
            error: true,
            title: '工地面积',
            placeholder: '填写工地面积（m²）',
            inputType: 'digit',
            componentId: 'area'
        },
        unit: {
            error: true,
            title: '工地户型',
            placeholder: '填写工地户型',
            componentId: 'unit'
        },
        address: {
            title: '工地地址',
            placeholder: '填写工地地址',
            // type: 'textarea',
            componentId: 'address'
        },
        price: {
            title: '工地价格',
            placeholder: '填写工地价格(单位元)',
            inputType: 'digit',
            componentId: 'price'
        },
        status: {
            title: '工地状态',
            placeholder: '填写工地状态',
            componentId: 'status'
        },
        info: {
            title: '',
            placeholder: '请在这输入描述...',
            componentId: 'info',
            type: 'textarea'
        }
    }
};
