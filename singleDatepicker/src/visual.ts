/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import { format, subDays, startOfMonth, addMonths } from 'date-fns';
import powerbi from "powerbi-visuals-api";
import FilterAction = powerbi.FilterAction;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import {
    IAdvancedFilter,
} from "powerbi-models";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

/**
 * ビジュアルの本体
 */
export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private visualHost: IVisualHost;

    private datepickerText: HTMLInputElement;

    private targetTableName: string;
    private targetColumnName: string;

    private prevCondition: string;

    constructor(options: VisualConstructorOptions) {
        this.visualHost = options.host;
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;

        if (document) {
            
            this.datepickerText = document.createElement('input');
            // ブラウザの機能に基づいた日付ピッカーが表示されることを期待する。
            this.datepickerText.type = "date";
            // ロケールに基づいた日付文字列が得られる
            this.datepickerText.value = format(subDays(new Date(), 1), "yyyy-MM");
            this.target.appendChild(this.datepickerText);

            this.datepickerText.addEventListener("change", (e) => {
                const ev = e.target as HTMLInputElement
                this.applyFilter(ev.value);
            });
            this.applyFilter(this.datepickerText.value);
        }
    }

    /**
     * 他ビジュアルの更新時フック
     * 
     * @param options VisualUpdateOptions
     */
    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);

        const textSetting = this.formattingSettings.dataPointCard;

        this.datepickerText.style.fontSize = `${textSetting.fontControl.fontSize.value}px`;
        this.datepickerText.style.color = textSetting.fontColor.value.value;
        this.datepickerText.style.fontFamily = textSetting.fontControl.fontFamily.value;
        this.datepickerText.style.fontWeight = textSetting.fontControl.bold?.value ? "bold" : "normal";
        this.datepickerText.style.fontStyle = textSetting.fontControl.italic?.value ? "italic" : "normal";
        this.datepickerText.style.backgroundColor = textSetting.background.value.value;

        // single なので決め打ち
        if (options.dataViews.length > 0 && options.dataViews[0].metadata.columns.length > 0) {
            const metadata = options.dataViews[0].metadata.columns[0];
            // テーブル名.列名 の形式になっていることを前提とする。
            this.targetTableName = metadata.queryName?.split('.')[0];
            this.targetColumnName = metadata.displayName;
            this.applyFilter(this.datepickerText.value);
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    /**
     * applyFilter
     * 
     * 指定した日付で対象データを絞り込み
     * 00:00:00 - 23:59:59
     * 
     * @param selectedMonth picked date
     * @returns void
     */
    public applyFilter(selectedMonth: string): void {
        // 同一条件で複数回クエリが飛ぶのを抑制
        if (this.prevCondition === selectedMonth) return;

        // 前提条件が整っていない場合はクエリを行わない
        if (!this.visualHost || !this.targetTableName || !this.targetColumnName) return;

        const fromDate = startOfMonth(`${selectedMonth}-01`);
        const toDate = addMonths(fromDate, 1);

        let conditions = [];
        // 日付入力があるときだけ検索
        if (selectedMonth || selectedMonth !== '') {
            // 日付時刻型を決め打ち
            conditions = [
                {
                    operator: "GreaterThanOrEqual",
                    value: fromDate.toISOString()
                },
                {
                    operator: "LessThen",
                    value: toDate.toISOString()
                }
            ]
            console.log(conditions);
        }

        // 指定した日付範囲の全ての時刻をFrom-Toで含める
        let filter: IAdvancedFilter = {
            $schema: "https://powerbi.com/product/schema#advanced",
            target: {
                table: this.targetTableName,
                column: this.targetColumnName
            },
            conditions,
            logicalOperator: "And",
            filterType: 0
        }
        this.visualHost.applyJsonFilter(filter, "general", "filter", FilterAction.merge);
        this.prevCondition = selectedMonth;
    }
}