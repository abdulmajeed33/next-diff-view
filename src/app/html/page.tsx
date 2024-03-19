import * as Diff2Html from "diff2html";
import { markdownDiff } from "markdown-diff";
import markdownit from "markdown-it/lib";

export default function Page(){

    const before = `
## How to Choose the Best VPN to Watch HBO Max in Singapore?
- **Server Network**: Opt for a VPN with a vast network of US servers to ensure reliable unblocking of HBO Max.
- **Speed**: Your VPN should provide fast connection speeds for high-quality streaming without buffering.
- **Compatibility**: Make sure the VPN is compatible with a wide range of devices and supports simultaneous connections.
- **Security**: Look for features like kill switches, split tunneling, and strong encryption to protect your connection.
- **Customer Support**: A VPN should offer 24/7 customer support to assist with any issues.
`
  let after =`
  ## How to Choose the Best VPN to Watch us Max in Singapore?
  - **Server Network**: Opt for a VPN with a vast network of US servers to ensure reliable unblocking of HBO Max.
  - **Speed**: Your VPN should provide fast connection speeds for high-quality streaming without buffering.
  - **Compatibility**: Make sure the VPN is compatible with a wide range of devices and supports simultaneous connections.
  - **Security**: Look for features like kill switches, split tunneling, and strong encryption to protect your connection.
  - **Customer Support**: A VPN should offer 24/7 customer support to assist with any issues.

  `

  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,  
    xhtmlOut: true,    
  })

  const diff = markdownDiff(before,after);
  const diffConvertHtml = md.render(diff);



  var diffHtml = Diff2Html.html(
    diff,
    {
      drawFileList: true,
      matching: "lines",
      outputFormat: "side-by-side",
      renderNothingWhenEmpty: false
    }
  );

  console.log("diffHtml",diffHtml);
      

    return(
        <div>
            <div id="code-diff" dangerouslySetInnerHTML={{ __html: diffHtml }}></div>
        </div>
    )

}