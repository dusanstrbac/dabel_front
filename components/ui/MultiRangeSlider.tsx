'use client';
import React, { forwardRef, JSX, useEffect, useRef, useState } from 'react';

type Props = {
	id?: string;
	min?: number | string;
	max?: number | string;
	step?: number | string;
	minValue?: number | string;
	maxValue?: number | string;
	baseClassName?: string;
	className?: string;
	disabled?: boolean;
	canMinMaxValueSame?: boolean;
	style?: React.CSSProperties;
	ruler?: boolean | string;
	label?: boolean | string;
	subSteps?: boolean | string;
	stepOnly?: boolean | string;
	preventWheel?: boolean | string;
	labels?: string[];
	minCaption?: string;
	maxCaption?: string;
	barLeftColor?: string;
	barRightColor?: string;
	barInnerColor?: string;
	thumbLeftColor?: string;
	thumbRightColor?: string;
	onInput?: (e: ChangeResult) => void;
	onChange?: (e: ChangeResult) => void;
};
export type ChangeResult = {
	min: number;
	max: number;
	minValue: number;
	maxValue: number;
};
let _wheelTimeout: number | null = null;
let _triggerTimeout: number | null = null;
const MultiRangeSlider = (props: Props, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => {
	let ruler = props.ruler === undefined || props.ruler === null ? true : props.ruler;
	let label = props.label === undefined || props.label === null ? true : props.label;
	let subSteps = props.subSteps === undefined || props.subSteps === null ? false : props.subSteps;
	let stepOnly = props.stepOnly === undefined || props.stepOnly === null ? false : props.stepOnly;
	let preventWheel = props.preventWheel === undefined || props.preventWheel === null ? false : props.preventWheel;
	let refBar = useRef<HTMLDivElement>(null);
	let min = +(props.min || 10);
	let max = +(props.max || 300000);
	let step = Math.abs(+(props.step || 5));
	let fixed = 0;
	let disabled = !!props.disabled;
	let stepValue = props.canMinMaxValueSame ? 0 : step;

	let stepCount = Math.floor((+max - +min) / +step);
	let labels: string[] = props.labels || [];
	if (labels.length === 0) {
		labels = [];
		labels.push(min.toString());
		labels.push(max.toString());
	} else {
		stepCount = labels.length - 1;
	}

	if (typeof label === 'string') {
		label = label === 'true';
	}
	if (typeof ruler === 'string') {
		ruler = ruler === 'true';
	}
	if (typeof preventWheel === 'string') {
		preventWheel = preventWheel === 'true';
	}
	if (step.toString().includes('.')) {
		fixed = 2;
	}
	let _minValue = props.minValue;
	if (_minValue === null || _minValue === undefined) {
		_minValue = min;
	}
	_minValue = +_minValue;
	let _maxValue = props.maxValue;
	if (_maxValue === null || _maxValue === undefined) {
		_maxValue = max;
	}
	_maxValue = +_maxValue;

	if (_minValue < min) {
		_minValue = min;
	}
	if (_minValue > max) {
		_minValue = max;
	}
	if (_maxValue < _minValue) {
		_maxValue = +_minValue + +step;
	}
	if (_maxValue > max) {
		_maxValue = max;
	}
	if (_maxValue < min) {
		_maxValue = min;
	}

	const [minValue, set_minValue] = useState(+_minValue);
	const [maxValue, set_maxValue] = useState(+_maxValue);
	const [barMin, set_barMin] = useState(((minValue - min) / (max - min)) * 100);
	const [barMax, set_barMax] = useState(((max - maxValue) / (max - min)) * 100);
	const [minCaption, setMinCaption] = useState<string>('');
	const [maxCaption, setMaxCaption] = useState<string>('');
	const [isChange, setIsChange] = useState(true);

	const onBarLeftClick = (e: React.MouseEvent) => {
		if (disabled) return;
		let _minValue = minValue - step;
		if (_minValue < min) {
			_minValue = min;
		}
		set_minValue(_minValue);
	};

	const onInputMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		let _minValue = parseFloat(e.target.value);
		if (_minValue > maxValue - stepValue) {
			_minValue = maxValue - stepValue;
		}
		set_minValue(_minValue);
		setIsChange(true);
	};
	const onLeftThumbMousedown: React.MouseEventHandler = (e: React.MouseEvent) => {
		if (disabled) return;
		let startX = e.clientX;
		let thumb = e.target as HTMLDivElement;
		let bar = thumb.parentNode as HTMLDivElement;
		let barBox = bar.getBoundingClientRect();
		let barValue = minValue;
		setIsChange(false);
		let onLeftThumbMousemove: { (e: MouseEvent): void } = (e: MouseEvent) => {
			let clientX = e.clientX;
			let dx = clientX - startX;
			let per = dx / barBox.width;
			let val = barValue + (max - min) * per;
			if (stepOnly) {
				val = Math.round(val / step) * step;
			}
			val = parseFloat(val.toFixed(fixed));
			if (val < min) {
				val = min;
			} else if (val > maxValue - stepValue) {
				val = maxValue - stepValue;
			}
			set_minValue(val);
		};
		let onLeftThumbMouseup: { (e: MouseEvent): void } = (e: MouseEvent) => {
			setIsChange(true);
			document.removeEventListener('mousemove', onLeftThumbMousemove);
			document.removeEventListener('mouseup', onLeftThumbMouseup);
		};
		document.addEventListener('mousemove', onLeftThumbMousemove);
		document.addEventListener('mouseup', onLeftThumbMouseup);
	};
	const onLeftThumbTouchStart = (e: React.TouchEvent) => {
		if (disabled) return;
		let startX = e.touches[0].clientX;
		let thumb = e.target as HTMLDivElement;
		let bar = thumb.parentNode as HTMLDivElement;
		let barBox = bar.getBoundingClientRect();
		let barValue = minValue;
		setIsChange(false);
		let onLeftThumbToucheMove: { (e: TouchEvent): void } = (e: TouchEvent) => {
			let clientX = e.touches[0].clientX;
			let dx = clientX - startX;
			let per = dx / barBox.width;
			let val = barValue + (max - min) * per;
			if (stepOnly) {
				val = Math.round(val / step) * step;
			}
			val = parseFloat(val.toFixed(fixed));
			if (val < min) {
				val = min;
			} else if (val > maxValue - stepValue) {
				val = maxValue - stepValue;
			}
			set_minValue(val);
		};
		let onLeftThumbTouchEnd: { (e: TouchEvent): void } = (e: TouchEvent) => {
			setIsChange(true);
			document.removeEventListener('touchmove', onLeftThumbToucheMove);
			document.removeEventListener('touchend', onLeftThumbTouchEnd);
		};

		document.addEventListener('touchmove', onLeftThumbToucheMove);
		document.addEventListener('touchend', onLeftThumbTouchEnd);
	};
	const onInnerBarLeftClick = (e: React.MouseEvent) => {
		if (disabled) return;
		let _minValue = minValue + step;
		if (_minValue > maxValue - stepValue) {
			_minValue = maxValue - stepValue;
		}
		set_minValue(_minValue);
	};
	const onInnerBarRightClick = (e: React.MouseEvent) => {
		if (disabled) return;
		let _maxValue = maxValue - step;
		if (_maxValue < minValue + stepValue) {
			_maxValue = minValue + stepValue;
		}
		set_maxValue(_maxValue);
	};
	const onInputMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		let _maxValue = parseFloat(e.target.value);
		if (_maxValue < minValue + stepValue) {
			_maxValue = minValue + stepValue;
		}
		set_maxValue(_maxValue);
		setIsChange(true);
	};
	const onRightThumbMousedown: React.MouseEventHandler = (e: React.MouseEvent) => {
		if (disabled) return;
		let startX = e.clientX;
		let thumb = e.target as HTMLDivElement;
		let bar = thumb.parentNode as HTMLDivElement;
		let barBox = bar.getBoundingClientRect();
		let barValue = maxValue;
		setIsChange(false);
		let onRightThumbMousemove: { (e: MouseEvent): void } = (e: MouseEvent) => {
			let clientX = e.clientX;
			let dx = clientX - startX;
			let per = dx / barBox.width;
			let val = barValue + (max - min) * per;
			if (stepOnly) {
				val = Math.round(val / step) * step;
			}
			val = parseFloat(val.toFixed(fixed));
			if (val < minValue + stepValue) {
				val = minValue + stepValue;
			} else if (val > max) {
				val = max;
			}
			set_maxValue(val);
		};
		let onRightThumbMouseup: { (e: MouseEvent): void } = (e: MouseEvent) => {
			setIsChange(true);
			document.removeEventListener('mousemove', onRightThumbMousemove);
			document.removeEventListener('mouseup', onRightThumbMouseup);
		};
		document.addEventListener('mousemove', onRightThumbMousemove);
		document.addEventListener('mouseup', onRightThumbMouseup);
	};
	const onRightThumbTouchStart = (e: React.TouchEvent) => {
		if (disabled) return;
		let startX = e.touches[0].clientX;
		let thumb = e.target as HTMLDivElement;
		let bar = thumb.parentNode as HTMLDivElement;
		let barBox = bar.getBoundingClientRect();
		let barValue = maxValue;
		setIsChange(false);
		let onRightThumbTouchMove: { (e: TouchEvent): void } = (e: TouchEvent) => {
			let clientX = e.touches[0].clientX;
			let dx = clientX - startX;
			let per = dx / barBox.width;
			let val = barValue + (max - min) * per;
			if (stepOnly) {
				val = Math.round(val / step) * step;
			}
			val = parseFloat(val.toFixed(fixed));
			if (val < minValue + stepValue) {
				val = minValue + stepValue;
			} else if (val > max) {
				val = max;
			}
			set_maxValue(val);
		};
		let onRightThumbTouchEnd: { (e: TouchEvent): void } = (e: TouchEvent) => {
			setIsChange(true);
			document.removeEventListener('touchmove', onRightThumbTouchMove);
			document.removeEventListener('touchend', onRightThumbTouchEnd);
		};
		document.addEventListener('touchmove', onRightThumbTouchMove);
		document.addEventListener('touchend', onRightThumbTouchEnd);
	};
	const onBarRightClick = (e: React.MouseEvent) => {
		if (disabled) return;
		let _maxValue = maxValue + step;
		if (_maxValue > max) {
			_maxValue = max;
		}
		set_maxValue(_maxValue);
	};
	const onMouseWheel = (e: React.WheelEvent) => {
		if (disabled) return;
		if (preventWheel === true) {
			return;
		}
		if (!e.shiftKey && !e.ctrlKey) {
			return;
		}
		let val = (max - min) / 100;
		if (val > 1) {
			val = 1;
		}
		if (e.deltaY < 0) {
			val = -val;
		}

		let _minValue = minValue;
		let _maxValue = maxValue;
		if (e.shiftKey && e.ctrlKey) {
			if (_minValue + val >= min && _maxValue + val <= max) {
				_minValue = _minValue + val;
				_maxValue = _maxValue + val;
			}
		} else if (e.ctrlKey) {
			val = _maxValue + val;
			if (val < _minValue + stepValue) {
				val = _minValue + stepValue;
			} else if (val > max) {
				val = max;
			}
			_maxValue = val;
		} else if (e.shiftKey) {
			val = _minValue + val;
			if (val < min) {
				val = min;
			} else if (val > _maxValue - stepValue) {
				val = _maxValue - stepValue;
			}
			_minValue = val;
		}
		setIsChange(false);
		set_maxValue(_maxValue);
		set_minValue(_minValue);
		_wheelTimeout && window.clearTimeout(_wheelTimeout);
		_wheelTimeout = window.setTimeout(() => {
			setIsChange(true);
		}, 100);
	};
	useEffect(() => { 
		if (refBar && refBar.current) {
			let bar = refBar.current as HTMLDivElement;
			let p_bar = bar.parentNode as HTMLDivElement;
			p_bar.addEventListener('wheel', (e) => {
				if (!e.shiftKey && !e.ctrlKey) {
					return;
				}
				e.preventDefault();
			});
		}
	}, [refBar]);

	useEffect(() => {
		if (maxValue < minValue) {
			throw new Error('maxValue is less than minValue');
		}
		const triggerChange = () => {
			let result: ChangeResult = { min, max, minValue, maxValue };
			isChange && props.onChange && props.onChange(result);
			props.onInput && props.onInput(result);
		};
		setMinCaption(props.minCaption || minValue.toFixed(fixed));
		setMaxCaption(props.maxCaption || maxValue.toFixed(fixed));
		let _barMin = ((minValue - min) / (max - min)) * 100;
		set_barMin(_barMin);
		let _barMax = ((max - maxValue) / (max - min)) * 100;
		set_barMax(_barMax);
		_triggerTimeout && window.clearTimeout(_triggerTimeout);
		_triggerTimeout = window.setTimeout(triggerChange, 20);
	}, [minValue, maxValue, min, max, fixed, props, isChange]);

	useEffect(() => {
		let _minValue = props.minValue;
		if (_minValue === null || _minValue === undefined) {
			_minValue = 25;
		}
		_minValue = +_minValue;
		if (_minValue < min) {
			_minValue = min;
		}
		if (_minValue > max) {
			_minValue = max;
		}
		setIsChange(false);
		set_minValue(+_minValue);
	}, [props.minValue, min, max]);
	useEffect(() => {
		let _maxValue = props.maxValue;
		if (_maxValue === null || _maxValue === undefined) {
			_maxValue = 75;
		}
		_maxValue = +_maxValue;

		if (_maxValue > max) {
			_maxValue = max;
		}
		if (_maxValue < min) {
			_maxValue = min;
		}
		setIsChange(false);
		set_maxValue(+_maxValue);
	}, [props.maxValue, min, max, step]);

return (
    <div
      ref={ref}
      id={props.id}
      className={`relative w-full max-w-2xl p-6 rounded-xl border ${
        disabled ? 'border-gray-300 bg-gray-100 text-gray-400' : 'border-gray-400 bg-white'
      } shadow-md transition-all duration-300 ${props.className || ''}`}
      style={props.style}
      onWheel={onMouseWheel}
    >
      {/* Slider Bar */}
      <div className="relative h-3 flex items-center w-full bg-gray-200 rounded-full" ref={refBar}>
        <div
          className="h-full rounded-l-full"
          style={{
            width: `${barMin}%`,
            backgroundColor: props.barLeftColor || '#e5e7eb',
          }}
          onClick={onBarLeftClick}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onInput={onInputMinChange}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        />
        <div
          className="absolute z-10 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
          style={{
            left: `${barMin}%`,
            backgroundColor: props.thumbLeftColor || '#3b82f6',
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={onLeftThumbMousedown}
          onTouchStart={onLeftThumbTouchStart}
        >
          <div className="absolute top-[-36px] left-1/2 -translate-x-1/2 w-max px-2 py-1 text-xs text-white bg-blue-600 rounded shadow">
            {minCaption}
          </div>
        </div>

        <div
          className="flex-grow relative bg-green-400 shadow-inner"
          style={{ backgroundColor: props.barInnerColor || '#4ade80' }}
          onClick={onInnerBarLeftClick}
        >
          <div className="absolute inset-y-0 left-0 w-1/2 cursor-pointer" />
          <div
            className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
            onClick={onInnerBarRightClick}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onInput={onInputMaxChange}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        />
        <div
          className="absolute z-10 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
          style={{
            right: `${barMax}%`,
            backgroundColor: props.thumbRightColor || '#3b82f6',
            transform: 'translate(50%, -50%)',
          }}
          onMouseDown={onRightThumbMousedown}
          onTouchStart={onRightThumbTouchStart}
        >
          <div className="absolute top-[-36px] left-1/2 -translate-x-1/2 w-max px-2 py-1 text-xs text-white bg-blue-600 rounded shadow">
            {maxCaption}
          </div>
        </div>

        <div
          className="h-full rounded-r-full"
          style={{
            width: `${barMax}%`,
            backgroundColor: props.barRightColor || '#e5e7eb',
          }}
          onClick={onBarRightClick}
        />
      </div>

      {/* Input polja ispod slidera */}
      <div className="flex justify-between gap-4 mt-4">
        <div className="flex flex-col items-start w-1/2">
          <label htmlFor="minValue" className="text-sm text-gray-600 mb-1">Min</label>
          <input
            id="minValue"
            type="number"
            min={min}
            max={maxValue - stepValue}
            value={minValue}
            onChange={onInputMinChange}
            className="w-full rounded border border-gray-300 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col items-end w-1/2">
          <label htmlFor="maxValue" className="text-sm text-gray-600 mb-1">Max</label>
          <input
            id="maxValue"
            type="number"
            min={minValue + stepValue}
            max={max}
            value={maxValue}
            onChange={onInputMaxChange}
            className="w-full rounded border border-gray-300 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(forwardRef<HTMLDivElement, Props>(MultiRangeSlider));
