import * as React from "react"
import { observable, computed, action } from "mobx"
import { observer } from "mobx-react"
import { ChartEditor } from "./ChartEditor"
import { Grapher } from "charts/core/Grapher"
import { ComparisonLineConfig } from "charts/scatterCharts/ComparisonLine"
import {
    NumberField,
    Toggle,
    FieldsRow,
    Section,
    BindAutoString,
    BindString,
    TextField,
    Button
} from "./Forms"
import { debounce } from "charts/utils/Util"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ColorSchemeDropdown, ColorSchemeOption } from "./ColorSchemeDropdown"
import { EditorColorScaleSection } from "./EditorColorScaleSection"

@observer
class ColorSchemeSelector extends React.Component<{ chart: Grapher }> {
    @action.bound onChange(selected: ColorSchemeOption) {
        // The onChange method can return an array of values (when multiple
        // items can be selected) or a single value. Since we are certain that
        // we are not using the multi-option select we can force the type to be
        // a single value.

        this.props.chart.script.baseColorScheme =
            selected.value === "default" ? undefined : selected.value
    }

    @action.bound onInvertColorScheme(value: boolean) {
        this.props.chart.script.invertColorScheme = value || undefined
    }

    render() {
        const { chart } = this.props

        return (
            <React.Fragment>
                <FieldsRow>
                    <div className="form-group">
                        <label>Color scheme</label>
                        <ColorSchemeDropdown
                            value={chart.baseColorScheme || "default"}
                            onChange={this.onChange}
                            invertedColorScheme={
                                !!chart.script.invertColorScheme
                            }
                            additionalOptions={[
                                {
                                    colorScheme: undefined,
                                    gradient: undefined,
                                    label: "Default",
                                    value: "default"
                                }
                            ]}
                        />
                    </div>
                </FieldsRow>
                <FieldsRow>
                    <Toggle
                        label="Invert colors"
                        value={!!chart.script.invertColorScheme}
                        onValue={this.onInvertColorScheme}
                    />
                </FieldsRow>
            </React.Fragment>
        )
    }
}

@observer
class TimelineSection extends React.Component<{ editor: ChartEditor }> {
    base: React.RefObject<HTMLDivElement> = React.createRef()

    @computed get chart() {
        return this.props.editor.grapher
    }

    @computed get minTime() {
        return this.chart.script.minTime
    }
    @computed get maxTime() {
        return this.chart.script.maxTime
    }

    @computed get timelineMinTime() {
        return this.chart.script.timelineMinTime
    }
    @computed get timelineMaxTime() {
        return this.chart.script.timelineMaxTime
    }

    @action.bound onMinTime(value: number | undefined) {
        this.chart.script.minTime = value
    }

    @action.bound onMaxTime(value: number | undefined) {
        this.chart.script.maxTime = value
    }

    @action.bound onTimelineMinTime(value: number | undefined) {
        this.chart.script.timelineMinTime = value
    }

    @action.bound onTimelineMaxTime(value: number | undefined) {
        this.chart.script.timelineMaxTime = value
    }

    @action.bound onToggleHideTimeline(value: boolean) {
        this.chart.script.hideTimeline = value || undefined
    }

    @action.bound onToggleShowYearLabels(value: boolean) {
        this.chart.script.showYearLabels = value || undefined
    }

    render() {
        const { features } = this.props.editor
        const { chart } = this

        return (
            <Section name="Timeline selection">
                <FieldsRow>
                    {features.timeDomain && (
                        <NumberField
                            label="Selection start"
                            value={chart.script.minTime}
                            onValue={debounce(this.onMinTime)}
                            allowNegative
                        />
                    )}
                    <NumberField
                        label={
                            features.timeDomain
                                ? "Selection end"
                                : "Selected year"
                        }
                        value={chart.script.maxTime}
                        onValue={debounce(this.onMaxTime)}
                        allowNegative
                    />
                </FieldsRow>
                {features.timelineRange && (
                    <FieldsRow>
                        <NumberField
                            label="Timeline min"
                            value={this.timelineMinTime}
                            onValue={debounce(this.onTimelineMinTime)}
                            allowNegative
                        />
                        <NumberField
                            label="Timeline max"
                            value={this.timelineMaxTime}
                            onValue={debounce(this.onTimelineMaxTime)}
                            allowNegative
                        />
                    </FieldsRow>
                )}
                <FieldsRow>
                    <Toggle
                        label="Hide timeline"
                        value={!!chart.script.hideTimeline}
                        onValue={this.onToggleHideTimeline}
                    />
                    {features.showYearLabels && (
                        <Toggle
                            label="Always show year labels"
                            value={!!chart.script.showYearLabels}
                            onValue={this.onToggleShowYearLabels}
                        />
                    )}
                </FieldsRow>
            </Section>
        )
    }
}

@observer
class ComparisonLineSection extends React.Component<{ editor: ChartEditor }> {
    @observable comparisonLines: ComparisonLineConfig[] = []

    @action.bound onAddComparisonLine() {
        const { grapher } = this.props.editor

        if (grapher.script.comparisonLines === undefined)
            grapher.script.comparisonLines = []

        grapher.script.comparisonLines.push({})
    }

    @action.bound onRemoveComparisonLine(index: number) {
        const { grapher } = this.props.editor

        grapher.script.comparisonLines!.splice(index, 1)

        if (grapher.script.comparisonLines!.length === 0)
            grapher.script.comparisonLines = undefined
    }

    render() {
        const { comparisonLines } = this.props.editor.grapher

        return (
            <Section name="Comparison line">
                <p>
                    Overlay a line onto the chart for comparison. Supports basic{" "}
                    <a href="https://github.com/silentmatt/expr-eval#expression-syntax">
                        mathematical expressions
                    </a>
                    .
                </p>

                <Button onClick={this.onAddComparisonLine}>
                    <FontAwesomeIcon icon={faPlus} /> Add comparison line
                </Button>
                {comparisonLines.map((comparisonLine, i) => (
                    <div key={i}>
                        {`Line ${i + 1}`}{" "}
                        <Button onClick={() => this.onRemoveComparisonLine(i)}>
                            <FontAwesomeIcon icon={faMinus} />
                        </Button>
                        <TextField
                            label={`y=`}
                            placeholder="x"
                            value={comparisonLine.yEquals}
                            onValue={action((value: string) => {
                                comparisonLine.yEquals = value || undefined
                            })}
                        />
                        <TextField
                            label="Label"
                            value={comparisonLine.label}
                            onValue={action((value: string) => {
                                comparisonLine.label = value || undefined
                            })}
                        />
                    </div>
                ))}
            </Section>
        )
    }
}

@observer
export class EditorCustomizeTab extends React.Component<{
    editor: ChartEditor
}> {
    render() {
        const xAxisOptions = this.props.editor.grapher.xAxis
        const yAxisOptions = this.props.editor.grapher.yAxis

        const { features } = this.props.editor
        const { grapher } = this.props.editor

        return (
            <div>
                {features.canCustomizeYAxis && (
                    <Section name="Y Axis">
                        {features.canCustomizeYAxisScale && (
                            <React.Fragment>
                                <FieldsRow>
                                    <NumberField
                                        label={`Min`}
                                        value={yAxisOptions.min}
                                        onValue={value =>
                                            (yAxisOptions.min = value)
                                        }
                                        allowDecimal
                                        allowNegative
                                    />
                                    <NumberField
                                        label={`Max`}
                                        value={yAxisOptions.max}
                                        onValue={value =>
                                            (yAxisOptions.max = value)
                                        }
                                        allowDecimal
                                        allowNegative
                                    />
                                </FieldsRow>
                                {features.canRemovePointsOutsideAxisDomain && (
                                    <FieldsRow>
                                        <Toggle
                                            label={`Remove points outside domain`}
                                            value={
                                                yAxisOptions.removePointsOutsideDomain ||
                                                false
                                            }
                                            onValue={value =>
                                                (yAxisOptions.removePointsOutsideDomain =
                                                    value || undefined)
                                            }
                                        />
                                    </FieldsRow>
                                )}
                                <FieldsRow>
                                    <Toggle
                                        label={`Enable log/linear selector`}
                                        value={
                                            yAxisOptions.canChangeScaleType ||
                                            false
                                        }
                                        onValue={value =>
                                            (yAxisOptions.canChangeScaleType =
                                                value || undefined)
                                        }
                                    />
                                </FieldsRow>
                            </React.Fragment>
                        )}
                        {features.canCustomizeYAxisLabel && (
                            <BindString
                                label="Label"
                                field="label"
                                store={yAxisOptions}
                            />
                        )}
                    </Section>
                )}
                {features.canCustomizeXAxis && (
                    <Section name="X Axis">
                        {features.canCustomizeXAxisScale && (
                            <React.Fragment>
                                <FieldsRow>
                                    <NumberField
                                        label={`Min`}
                                        value={xAxisOptions.min}
                                        onValue={value =>
                                            (xAxisOptions.min = value)
                                        }
                                        allowDecimal
                                        allowNegative
                                    />
                                    <NumberField
                                        label={`Max`}
                                        value={xAxisOptions.max}
                                        onValue={value =>
                                            (xAxisOptions.max = value)
                                        }
                                        allowDecimal
                                        allowNegative
                                    />
                                </FieldsRow>
                                {features.canRemovePointsOutsideAxisDomain && (
                                    <FieldsRow>
                                        <Toggle
                                            label={`Remove points outside domain`}
                                            value={
                                                xAxisOptions.removePointsOutsideDomain ||
                                                false
                                            }
                                            onValue={value =>
                                                (xAxisOptions.removePointsOutsideDomain =
                                                    value || undefined)
                                            }
                                        />
                                    </FieldsRow>
                                )}
                                <FieldsRow>
                                    <Toggle
                                        label={`Enable log/linear selector`}
                                        value={
                                            xAxisOptions.canChangeScaleType ||
                                            false
                                        }
                                        onValue={value =>
                                            (xAxisOptions.canChangeScaleType =
                                                value || undefined)
                                        }
                                    />
                                </FieldsRow>
                            </React.Fragment>
                        )}
                        {features.canCustomizeXAxisLabel && (
                            <BindString
                                label="Label"
                                field="label"
                                store={xAxisOptions}
                            />
                        )}
                    </Section>
                )}
                <TimelineSection editor={this.props.editor} />
                <Section name="Color scheme">
                    <ColorSchemeSelector chart={grapher} />
                </Section>
                {grapher.activeColorScale && (
                    <EditorColorScaleSection
                        scale={grapher.activeColorScale}
                        features={{
                            visualScaling: false,
                            legendDescription:
                                grapher.isScatter ||
                                grapher.isSlopeChart ||
                                grapher.isStackedBar
                        }}
                    />
                )}
                {(features.hideLegend || features.entityType) && (
                    <Section name="Legend">
                        <FieldsRow>
                            {features.hideLegend && (
                                <Toggle
                                    label={`Hide legend`}
                                    value={!!grapher.hideLegend}
                                    onValue={value =>
                                        (grapher.script.hideLegend =
                                            value || undefined)
                                    }
                                />
                            )}
                        </FieldsRow>
                        {features.entityType && (
                            <BindAutoString
                                label="Entity name"
                                field="entityType"
                                store={grapher.script}
                                auto="country"
                            />
                        )}
                    </Section>
                )}
                {features.relativeModeToggle && (
                    <Section name="Controls">
                        <FieldsRow>
                            <Toggle
                                label={`Hide relative toggle`}
                                value={!!grapher.script.hideRelativeToggle}
                                onValue={value =>
                                    (grapher.script.hideRelativeToggle =
                                        value || false)
                                }
                            />
                        </FieldsRow>
                    </Section>
                )}
                {features.comparisonLine && (
                    <ComparisonLineSection editor={this.props.editor} />
                )}
            </div>
        )
    }
}
