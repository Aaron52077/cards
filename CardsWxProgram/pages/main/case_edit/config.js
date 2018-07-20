module.exports = {
    // Form 中使用输入框
    form: {
        name: {
            error: true,
            title: '案例名称',
            placeholder: '填写案例名称',
            componentId: 'name'
        },
        style: {
            error: true,
            title: '风格',
            placeholder: '填写风格',
            componentId: 'style'
        },
        area: {
            error: true,
            title: '面积',
            placeholder: '填写面积',
            inputType: 'digit',
            componentId: 'area'
        },
        unit: {
            error: true,
            title: '户型',
            placeholder: '填写户型',
            componentId: 'unit'
        },
        address: {
            title: '工地地址',
            placeholder: '填写工地地址',
            // type: 'textarea',
            componentId: 'address'
        },
        price: {
            title: '案例造价',
            placeholder: '填写案例造价',
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
