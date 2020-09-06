import * as React from "react"
import { action } from "mobx"
import { observer } from "mobx-react"
import { ChartEditor } from "./ChartEditor"
import {
    Toggle,
    Section,
    BindString,
    BindAutoString,
    AutoTextField,
    RadioGroup,
    TextField,
    Button
} from "./Forms"
import { LogoOption } from "charts/chart/Logos"
import slugify from "slugify"
import { RelatedQuestionsConfig } from "charts/core/GrapherConstants"
import { getErrorMessageRelatedQuestionUrl } from "charts/utils/Util"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus"

@observer
export class EditorTextTab extends React.Component<{ editor: ChartEditor }> {
    @action.bound onSlug(slug: string) {
        this.props.editor.grapher.slug = slugify(slug).toLowerCase()
    }

    @action.bound onChangeLogo(value: string) {
        if (value === "none") {
            this.props.editor.grapher.hideLogo = true
        } else {
            this.props.editor.grapher.hideLogo = undefined
            this.props.editor.grapher.logo = (value as LogoOption) || undefined
        }
    }

    @action.bound onAddRelatedQuestion() {
        const { grapher } = this.props.editor
        if (!grapher.relatedQuestions) {
            grapher.relatedQuestions = []
        }
        grapher.relatedQuestions.push({
            text: "",
            url: ""
        })
    }

    @action.bound onRemoveRelatedQuestion(idx: number) {
        const { grapher } = this.props.editor

        if (grapher.relatedQuestions) {
            grapher.relatedQuestions.splice(idx, 1)
            if (grapher.relatedQuestions.length === 0) {
                grapher.relatedQuestions = undefined
            }
        }
    }

    render() {
        const { grapher, references } = this.props.editor
        const { relatedQuestions } = grapher

        return (
            <div>
                <Section name="Header">
                    <BindAutoString
                        field="title"
                        store={grapher}
                        auto={grapher.displayTitle}
                        softCharacterLimit={100}
                    />
                    <Toggle
                        label="Hide automatic time/entity"
                        value={!!grapher.hideTitleAnnotation}
                        onValue={action(
                            (value: boolean) =>
                                (grapher.hideTitleAnnotation =
                                    value || undefined)
                        )}
                    />
                    <AutoTextField
                        label="/grapher"
                        value={grapher.displaySlug}
                        onValue={this.onSlug}
                        isAuto={grapher.slug === undefined}
                        onToggleAuto={() =>
                            (grapher.slug =
                                grapher.slug === undefined
                                    ? grapher.displaySlug
                                    : undefined)
                        }
                        helpText="Human-friendly URL for this chart"
                    />
                    <BindString
                        field="subtitle"
                        store={grapher}
                        placeholder="Briefly describe the context of the data. It's best to avoid duplicating any information which can be easily inferred from other visual elements of the chart."
                        textarea
                        softCharacterLimit={280}
                    />
                    <h6>Logo</h6>
                    <RadioGroup
                        options={[
                            { label: "OWID", value: "owid" },
                            { label: "CORE+OWID", value: "core+owid" },
                            { label: "GV+OWID", value: "gv+owid" },
                            { label: "No logo", value: "none" }
                        ]}
                        value={
                            grapher.hideLogo ? "none" : grapher.logo || "owid"
                        }
                        onChange={this.onChangeLogo}
                    />
                </Section>
                <Section name="Footer">
                    <BindAutoString
                        label="Source"
                        field="sourceDesc"
                        store={grapher}
                        auto={grapher.sourcesLine}
                        helpText="Short comma-separated list of source names"
                        softCharacterLimit={60}
                    />
                    <BindString
                        label="Origin url"
                        field="originUrl"
                        store={grapher}
                        placeholder={grapher.originUrlWithProtocol}
                        helpText="The page containing this chart where more context can be found"
                    />
                    {references && references.length > 0 && (
                        <div className="originSuggestions">
                            <p>Origin url suggestions</p>
                            <ul>
                                {references.map(post => (
                                    <li key={post.id}>{post.url}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <BindString
                        label="Footer note"
                        field="note"
                        store={grapher}
                        helpText="Any important clarification needed to avoid miscommunication"
                        softCharacterLimit={140}
                    />
                </Section>
                <Section name="Related">
                    {relatedQuestions &&
                        relatedQuestions.map(
                            (question: RelatedQuestionsConfig, idx: number) => (
                                <div key={idx}>
                                    <TextField
                                        label="Related question"
                                        value={question.text}
                                        onValue={action((value: string) => {
                                            question.text = value
                                        })}
                                        placeholder="e.g. How did countries respond to the pandemic?"
                                        helpText="Short question promoting exploration of related content"
                                        softCharacterLimit={50}
                                    />
                                    {question.text && (
                                        <TextField
                                            label="URL"
                                            value={question.url}
                                            onValue={action((value: string) => {
                                                question.url = value
                                            })}
                                            placeholder="e.g. https://ourworldindata.org/coronavirus"
                                            helpText="Page or section of a page where the answer to the previous question can be found."
                                            errorMessage={getErrorMessageRelatedQuestionUrl(
                                                question
                                            )}
                                        />
                                    )}
                                    <Button
                                        onClick={() =>
                                            this.onRemoveRelatedQuestion(idx)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faMinus} />{" "}
                                        Remove related question
                                    </Button>
                                </div>
                            )
                        )}
                    {(!relatedQuestions || !relatedQuestions.length) && (
                        <Button onClick={this.onAddRelatedQuestion}>
                            <FontAwesomeIcon icon={faPlus} /> Add related
                            question
                        </Button>
                    )}
                </Section>
                <Section name="Misc">
                    <BindString
                        label="Internal author notes"
                        field="internalNotes"
                        store={grapher}
                        placeholder="e.g. WIP, needs review, etc"
                        textarea
                    />
                    <BindString
                        label="Variant name"
                        field="variantName"
                        store={grapher}
                        placeholder="e.g. IHME data"
                        helpText="Optional variant name for distinguishing charts with the same title"
                    />
                </Section>
            </div>
        )
    }
}
