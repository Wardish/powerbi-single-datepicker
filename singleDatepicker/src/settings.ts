/*
 *  Power BI Visualizations
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

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {
    fontControl = new formattingSettings.FontControl({
        name: "fontFamily",
        displayName: "フォント",
        fontFamily: new formattingSettings.FontPicker({
            name: "fontFamily",
            displayName: "フォント",
            value: "Segoe UI, Arial"
        }),
        fontSize: new formattingSettings.NumUpDown({
            name: "fontSize",
            displayName: "font Size",
            value: 10,
            options: {
                minValue: {
                    type: powerbi.visuals.ValidatorType.Min,
                    value: 8,
                }
            }
        }),
        bold: new formattingSettings.ToggleSwitch({
            name: "bold",
            displayName: "Font Size",
            value: false,
        }),
        italic: new formattingSettings.ToggleSwitch({
            name: "italic",
            displayName: "Font Size",
            value: false,
        }),
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "テキストの色",
        value: { value: "" }
    });

    background = new formattingSettings.ColorPicker({
        name: "background",
        displayName: "背景色",
        value: { value: "" }
    });

    name: string = "dataPoint";
    displayName: string = "値";
    slices: Array<FormattingSettingsSlice> = [
        this.fontControl,
        this.fontColor,
        this.background,
    ];
}

/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    dataPointCard = new DataPointCardSettings();

    cards = [this.dataPointCard];
}
