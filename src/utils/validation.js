const $ = document.querySelector.bind(document);

// Đối tượng 'Validator'
function Validator({ form, formGroupSelector, rules, errorSelector, onSubmit }) {
    function getParent(element, selector) {
        while (element && element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
        return null;
    }

    const selectorRules = {};

    // Hàm thực hiện Validate
    function validate(inputElement, rule) {
        var parentElement = getParent(inputElement, formGroupSelector);
        if (parentElement) {
            var errorElement = parentElement.querySelector(errorSelector);
        }
        var errorMessage;

        // Lấy ra các rules của selectorRules
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rules & kiểm tra
        // Nếu mà có lỗi thì dừng việc kiểm tra
        for (let i = 0; i < rules.length; ++i) {
            if (inputElement) {
                switch (inputElement.type) {
                    case 'radio':
                    case 'checkbox':
                        errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                        break;
                    default:
                        errorMessage = rules[i](inputElement.value);
                }
                if (errorMessage) break;
            }
        }
        if (errorElement) {
            if (errorMessage) {
                errorElement.innerText = errorMessage;
                const parentElement = getParent(inputElement, formGroupSelector);
                if (parentElement) {
                    parentElement.classList.add('invalid');
                }
            } else {
                if (errorElement) {
                    errorElement.innerText = '';
                }
                const parentElement = getParent(inputElement, formGroupSelector);
                if (parentElement) {
                    parentElement.classList.remove('invalid');
                }
            }
        }
        return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement = $(form);

    if (formElement) {
        // Xử lý submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rules và validate
            rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trường hợp submit với javascript
                if (typeof onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');

                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        switch (input.type) {
                            case 'radio':
                            case 'checkbox':
                                var a = (values[input.name] = formElement.querySelector(
                                    'input[name="' + input.name + '"]:checked',
                                ).value);

                                console.log(a);
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});

                    onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    // Dùng submit mặc định
                    formElement.submit();
                }
            }
        };

        // Xử lý lặp qua mỗi rule và xử lý (lắng nghe sự kiện)
        rules.forEach((rule) => {
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach((inputElement) => {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    // value: inputElement.value
                    // test func: rule.test
                    validate(inputElement, rule);
                };

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, formGroupSelector).querySelector(errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, formGroupSelector).classList.remove('invalid');
                };
            });
        });
    }
}

// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi họp lệ => Không trả cái gì cả  (undefined)
export const isRequired = function (selector, message) {
    return {
        selector,
        test(value) {
            return value ? undefined : message || 'Vui lòng nhập trường này!';
        },
    };
};

export const isEmail = function (selector, message) {
    return {
        selector,
        test(value) {
            var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email!';
        },
    };
};

export const isValidPassword = function (selector, message) {
    return {
        selector,
        test(value) {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
            return regex.test(value)
                ? undefined
                : message ||
                      'Mật khẩu phải chứa ít nhất một chữ số, một chữ cái viết thường, một chữ cái viết hoa và một ký tự đặc biệt';
        },
    };
};

export const minLength = function (selector, min, message) {
    return {
        selector,
        test(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        },
    };
};

export const isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector,
        test(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        },
    };
};

export default Validator;
