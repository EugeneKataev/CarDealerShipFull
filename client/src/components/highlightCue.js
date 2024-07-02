import style_cue from "./highlightCue.module.css";

const highlightCue = (cueClass, option) =>{
    let styleCue = option === "info" ? style_cue.highlightInfo : style_cue.highlight;
    const clientSelections = document.querySelectorAll(cueClass);
    clientSelections.forEach(clientSelection => {
        clientSelection.classList.add(styleCue);
    });
    setTimeout(() => {
        clientSelections.forEach(clientSelection => {
            clientSelection.classList.remove(styleCue);
        });
    }, 2000);
}
export default highlightCue;