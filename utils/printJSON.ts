export default function printJSON(arg: any) {
    const json = JSON.stringify(arg, null, 3)
    console.log(json);
    return json
}