import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { addBasePlugins, AssetManagerPlugin, CanvasRecorderPlugin, CanvasSnipperPlugin, DiamondPlugin, FileTransferPlugin, GroundPlugin, MaterialConfiguratorPlugin, PopmotionPlugin, SimpleTextPlugin, VariationConfiguratorPlugin, ViewerApp } from "webgi";
import { FormControlLabel, Switch } from "@mui/material";

const CanvasRenderComponent = (props: any) => {
    // ---- State's ----
    const [viewer, setViewer] = useState<any>();
    const [config, setConfig] = useState<VariationConfiguratorPlugin>();
    const [isBand, setIsBand] = useState<boolean>(false)
    const imageUrl = "https://dr2mfr65joexd.cloudfront.net/configurator/static/";
    const [showLoader, setShowLoader] = useState<boolean>(false);

    async function setupViewer() {
        // Initialize the viewer
        const viewer: any = new ViewerApp({
            canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
            useRgbm: true,
            assetManager: {},
        });
        setViewer(viewer);
    }
    useEffect(() => {
        setTimeout(() => {
            setTimeout(() => {
                setupViewer();
            }, 100);
        }, 100);
    }, []);


    const setViewerControls = useCallback(async () => {
        const manager = await viewer.addPlugin(AssetManagerPlugin);
        await addBasePlugins(viewer);
        await viewer.addPlugin(CanvasSnipperPlugin);
        await viewer.addPlugin(MaterialConfiguratorPlugin);
        await viewer.addPlugin(FileTransferPlugin);
        await viewer.addPlugin(CanvasRecorderPlugin);
        await viewer.addPlugin(PopmotionPlugin);
        await viewer.addPlugin(SimpleTextPlugin);
        await viewer.addPlugin(GroundPlugin);
        viewer.renderer.refreshPipeline();
        // this must be called once after all plugins are added.
        const options = { autoScale: false, autoCenter: false, useRgbm: true };
        viewer.enable = false;
        viewer.renderEnabled = false;
        const config = await viewer.addPlugin(VariationConfiguratorPlugin);

        await Promise.all([
            manager.addAsset({ path: `${imageUrl}${props.uv_glb}`, options: options }),
            manager.addAsset({ path: `${imageUrl}config_tcc_2410.vjson` }),
            manager.addAsset({ path: `${props.jsonFile}` }),
        ]);

        const fileStates: any = {};

        const importer: any = await manager.importer;

        importer.addEventListener("importFile", (ev: any) => {
            fileStates[ev.path] =
                ev.state + (ev.progress ? " " + (ev.progress * 100).toFixed(2) : "");
        });

        // Callbacks for start, progress, load complete and stop.
        importer.addEventListener("onStart", () => {
            setShowLoader(true);
        });
        importer.addEventListener("onProgress", () => {
            setShowLoader(true);
        });
        importer.addEventListener("onLoad", () => {
            setShowLoader(false);
        });
        importer.addEventListener("onStop", () => {
            setShowLoader(false);
        });
        await Promise.all([
            manager.addAsset({ path: "/assets/preset.CameraViews.json" }),
        ]);

        viewer.getManager().importer.registerFile("temp.glb").preparsers[0].key = (
            _encryption: any,
            _json: any,
            a: any
        ) => {
            if (props.showBand === true) {
                if (a.includes("Bands/")) {
                    return "d\{H9KprfAxqh";
                } else {
                    return "ObECsgKY3qJ\$";
                }
            } else {
                if (a.includes("Bands/")) {
                    return "d\{H9KprfAxqh";
                } else {
                    return props.glbKey;
                }
            }

        };
        setConfig(config);
    }, [props.jsonFile, props.glbKey, imageUrl, viewer]);

    useEffect(() => {
        if (viewer) {
            setViewerControls();
        }
    }, [setViewerControls, props.glbKey, viewer, props]);

    const setMaterial = useCallback(async () => {
        if (viewer) {
            viewer.enable = false;
            viewer.renderEnabled = false;
            const ygMaterial = await viewer
                .getManager()
                .importer.importSinglePath("/assets/Pmat/YG.pmat");

            const traverseFunction = async function (child: any) {
                let headMaterial = ygMaterial;
                let shankMaterial = ygMaterial;
                let bandMaterial = ygMaterial;

                //Band Metal
                if (child.name.includes("Metal03")) {
                    await child.setMaterial(bandMaterial);
                }

                //Head Metal
                if (child.name.includes("Metal01")) {
                    await child.setMaterial(headMaterial);
                }

                //SHank Metal
                if (child.name.includes("Metal02")) {
                    await child.setMaterial(shankMaterial);
                }

                const extension = ".dmat";

                if (child.name.includes("Diamond") || child.name.includes("Gem") || child.name.includes("Side_Dia")) {
                    let dmatName = "RD-";
                    let dmatPrefix = "RD-";
                    let sideDmatName = "RD-";
                    let smallDmatName = "Diamond" + extension;
                    let cacheKey = "";

                    if (
                        child.name.includes("Diamond_Oval") ||
                        child.name.includes("Diamond__Oval")
                    ) {
                        dmatPrefix = "OV-";
                        cacheKey = "Diamond_Oval";
                    }

                    if (child.name.includes("CS_Diamond")) {
                        dmatPrefix = "RD-";
                        cacheKey = "CS_Diamond_Round";
                    }

                    if (child.name.includes("Diamond_Emerald")) {
                        dmatPrefix = "EM-";
                        cacheKey = "Diamond_Emerald";
                    }

                    if (
                        child.name.includes("Diamond_Pear") ||
                        child.name.includes("Pear_CS")
                    ) {
                        dmatPrefix = "PE-";
                        cacheKey = "Diamond_Pear";
                    }
                    if (child.name.includes("Diamond_Princess")) {
                        dmatPrefix = "PR-";
                        cacheKey = "Diamond_Princess";
                    }
                    if (child.name.includes("Diamond_Radiant")) {
                        dmatPrefix = "RA-";
                        cacheKey = "Diamond_Radiant";
                    }
                    if (child.name.includes("Diamond_Marquise")) {
                        dmatPrefix = "MQ-";
                        cacheKey = "Diamond_Marquise";
                    } if (
                        child.name.includes("Diamond_Cushion") ||
                        child.name.includes("Diamond_cushion")
                    ) {
                        dmatPrefix = "CU-";
                        cacheKey = "Diamond_Cushion";
                    }
                    if (child.name.includes("Diamond_Round")) {
                        dmatPrefix = "RD-";
                        cacheKey = "Diamond_Round";
                    }
                    if (child.name.includes("Diamond_Emerald_Square")) {
                        dmatPrefix = "AS-";
                        cacheKey = "Diamond_Emerald_Square";
                    }
                    if (child.name.includes("Diamond_Radiant_Square")) {
                        dmatPrefix = "RA-";
                        cacheKey = "Diamond_Radiant_Square";
                    }
                    dmatName = props.centerDiamond + extension;
                    sideDmatName = props.sideDiamond + extension;
                    if (props?.detailData?.product_type === "Ring" || props?.detailData?.product_type === "Three stone") {
                        if (
                            child.name.includes("Diamond_Oval") ||
                            child.name.includes("Diamond__Oval") ||
                            child.name.includes("CS_Diamond") ||
                            child.name.includes("Diamond_Emerald") ||
                            child.name.includes("Diamond_Pear") ||
                            child.name.includes("Pear_CS") ||
                            child.name.includes("Diamond_Princess") ||
                            child.name.includes("Diamond_Marquise") ||
                            child.name.includes("Diamond_Radiant")
                        ) {
                            const diamondMaterial = await viewer
                                .getManager()
                                .importer.importSinglePath("/assets/BDDmat/" + dmatName);

                            await viewer.getPlugin(DiamondPlugin).prepareDiamondMesh(child, {
                                cacheKey: cacheKey,
                                normalMapRes: 512,
                            });
                            await child.setMaterial(diamondMaterial);
                        } else {
                            const smallDiamondMaterial = await viewer
                                .getManager()
                                .importer.importSinglePath("/assets/BDDmat/" + smallDmatName);
                            await viewer.getPlugin(DiamondPlugin).prepareDiamondMesh(child, {
                                cacheKey: "Diamond_Round",
                                normalMapRes: 256,
                            });
                            await child.setMaterial(smallDiamondMaterial);
                        }
                        if (
                            child.name.includes("_Side") ||
                            child.name.includes("Side_Dia") ||
                            child.name.includes("_side") ||
                            child.name.includes("side_Dia")
                        ) {
                            const diamondMaterial = await viewer
                                .getManager()
                                .importer.importSinglePath("/assets/BDDmat/" + sideDmatName);

                            await viewer.getPlugin(DiamondPlugin).prepareDiamondMesh(child, {
                                cacheKey: cacheKey,
                                normalMapRes: 256,
                            });
                            await child.setMaterial(diamondMaterial);
                        }
                    } else {
                        let dmatOneName = ''
                        dmatOneName = props.centerDiamond + extension;
                        let dmatTwoName = ""
                        dmatTwoName = props.sideDiamond + extension
                        const diamondMaterial = await viewer
                            .getManager()
                            .importer.importSinglePath("/assets/BDDmat/" + dmatOneName);

                        await viewer.getPlugin(DiamondPlugin).prepareDiamondMesh(child, {
                            cacheKey: cacheKey,
                            normalMapRes: 512,
                        });
                        await child.setMaterial(diamondMaterial);
                        if (
                            child.name.includes(cacheKey + "_2") ||
                            child.name.includes(cacheKey + "__2")
                        ) {

                            const diamondMaterial = await viewer
                                .getManager()
                                .importer.importSinglePath("/assets/BDDmat/" + dmatTwoName);
                            await viewer.getPlugin(DiamondPlugin).prepareDiamondMesh(child, {
                                cacheKey: cacheKey,
                                normalMapRes: 256,
                            });
                            await child.setMaterial(diamondMaterial);
                        }
                    }
                }
            };
            let allPromises: any[] = [];
            viewer.scene.traverse((child: any) => {
                allPromises.push(traverseFunction(child));
            });
            await Promise.all(allPromises);
            viewer.enable = true;
            viewer.renderEnabled = true;
            viewer.scene.activeCamera._controls.maxDistance = 350;
            viewer.scene.activeCamera._controls.minDistance = 28;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewer, props]);

    const refreshUI = useCallback(async () => {
        const configDetails = props?.detailData;
        // ! Return if value is undefined or Null
        if (configDetails === undefined || configDetails === null) {
            return;
        }
        if (viewer && config && config?.variations && config?.variations.objects) {
            viewer.enable = false;
            viewer.renderEnabled = false;
            const finalHeadName = parseInt(configDetails?.head_no);
            const finalShankName = parseInt(configDetails?.shank_no);
            const finalBandName = parseInt(configDetails?.band_no);
            const styleNo = parseInt(configDetails.style_no)
            if (Number.isNaN(styleNo)) {
                //* Final Head Name
                if (finalHeadName) {
                    const object = config?.variations?.objects?.find(
                        (obj) => obj?.name == "Heads"
                    );
                    if (object) {
                        const index = object?.items?.findIndex((t: any) =>
                            t.includes(finalHeadName)
                        );
                        await config?.applyVariation(object, index, "objects");
                    }
                }
                //* Final Shank Name
                if (finalShankName) {
                    const object = config?.variations?.objects?.find(
                        (obj) => obj.name == "Shanks"
                    );
                    if (object) {
                        const index = object.items.findIndex((t: any) =>
                            t.includes(finalShankName)
                        );
                        await config?.applyVariation(object, index, "objects");
                    }
                }
                // ** Final Band Name
                if (isBand === true) {
                    if (finalBandName && isBand === true) {
                        const object = config?.variations?.objects.find(
                            (obj) => obj?.name === "Bands"
                        );
                        if (object) {
                            const index = object?.items?.findIndex((t: any) =>
                                t.includes(finalBandName)
                            );
                            await config?.applyVariation(object, index, "objects");
                        }
                    }
                } else {
                    const object = config?.variations.objects.find(
                        (obj) => obj.name === "Bands"
                    )!;
                    if (object) {
                        const index = object?.items.findIndex((t: any) => t.includes("empty"));
                        await config?.applyVariation(object, index, "objects");
                    }
                }
            } else {
                const object = config?.variations?.objects?.find(
                    (obj) => obj?.name == "Heads"
                );
                if (object) {
                    const index = object?.items?.findIndex((t: any) =>
                        t.includes(styleNo)
                    );

                    await config?.applyVariation(object, index, "objects");
                }
            }
            await setMaterial();
            viewer.enable = true;
            viewer.renderEnabled = true;
            viewer.scene.setDirty();
        }


    }, [
        props,
        isBand,
        config,
        setMaterial,
        props?.detailData,
        viewer,
    ]);

    useEffect(() => {
        refreshUI();
    }, [refreshUI, props]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsBand(event.target.checked)
    }
    return (
        <div className="relative-container">
            <canvas
                id="webgi-canvas"
                style={{ marginTop: '30px', position: 'relative', height: '350px', alignItems: 'center', width: '100%' }}
                className="relative"
            ></canvas>
            <div className="progress-buttons">
                {showLoader && <div className="progressState"></div>}
            </div>
            {props.showBand === true &&
                <div>
                    <FormControlLabel className="centered-switch" label='Band' control={<Switch checked={isBand} onChange={handleChange} />} />
                </div>
            }
        </div>

    )
}
export default CanvasRenderComponent